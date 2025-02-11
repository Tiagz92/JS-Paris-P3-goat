import type { RowDataPacket } from "mysql2";
import client from "../../../database/client";
import { generateGoogleMeetLink } from "../../../src/utils/googleMeet";
import { sendReservationEmail } from "../../../src/utils/mailService";
import type { Reservation } from "../../types/models";
import { ReservationRepository } from "./ReservationRepository";

// On omet la propriété "constructor" pour éviter les problèmes liés à RowDataPacket.
interface ReservationResponse
	extends Omit<Partial<Reservation>, "constructor"> {
	insertId: number;
	google_meet_link: string;
	status: "pending" | "confirmed" | "cancelled" | "completed" | undefined;
}

export const ReservationActions = {
	async createReservation(
		userId: number,
		slotId: number,
	): Promise<ReservationResponse> {
		try {
			// Vérifier la disponibilité du créneau
			const [slotRows] = await client.query<RowDataPacket[]>(
				"SELECT * FROM slot WHERE id = ? AND status = 'available'",
				[slotId],
			);

			if (slotRows.length === 0) {
				throw new Error("Slot not found or not available");
			}

			// Récupérer les détails du créneau
			const slot = slotRows[0];
			const startTime = new Date(slot.start_time);
			// Calculer l'heure de fin à partir de la durée (supposée en minutes)
			const duration = Number(slot.duration);
			const endTime = new Date(startTime.getTime() + duration * 60000);

			// Générer le lien Google Meet pour la plage horaire
			const google_meet_link = await generateGoogleMeetLink(startTime, endTime);

			// Créer la réservation (on retire start_at et duration car ils ne font pas partie du schéma)
			const reservation = await ReservationRepository.create({
				slot_id: slotId,
				user_id: userId,
				google_meet_link,
			});

			if (!reservation) {
				throw new Error(
					"Reservation creation failed: Slot not found or not available",
				);
			}

			// Préparer les détails pour le mail (adapter selon vos besoins)
			const reservationDetails = {
				id: reservation.id,
				slot: slot.start_time, // Vous pouvez formatter cette date
				google_meet_link: reservation.google_meet_link,
			};

			// Envoyer l'email récapitulatif (l'adresse email est à adapter)
			await sendReservationEmail(
				"destinataire@example.com",
				reservationDetails,
			);

			return {
				insertId: reservation.id,
				google_meet_link: reservation.google_meet_link,
				status: reservation.status || "confirmed",
			};
		} catch (error) {
			console.error("Error creating reservation:", error);
			throw error;
		}
	},

	async getReservationById(id: number): Promise<Reservation> {
		const reservation = await ReservationRepository.findById(id);
		if (!reservation) {
			throw new Error("Reservation not found");
		}
		return reservation;
	},

	async getUserReservations(userId: number): Promise<Reservation[]> {
		const reservations =
			await ReservationRepository.getUserReservations(userId);
		for (const reservation of reservations) {
			if (
				!reservation.google_meet_link?.startsWith("https://meet.google.com/")
			) {
				console.warn(`Invalid Meet link for reservation ${reservation.id}`);
			}
		}
		return reservations;
	},

	async cancelReservation(
		userId: number,
		reservationId: number,
	): Promise<boolean> {
		try {
			const reservation = await this.getReservationById(reservationId);
			if (reservation.user_id !== userId) {
				throw new Error("Unauthorized");
			}

			const [slotRows] = await client.query<RowDataPacket[]>(
				"SELECT start_time FROM slot WHERE id = ?",
				[reservation.slot_id],
			);

			if (slotRows.length === 0) {
				throw new Error("Slot not found");
			}

			const slot = slotRows[0];
			const startTime = new Date(slot.start_time);
			const now = new Date();
			const hoursUntilStart =
				(startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
			if (hoursUntilStart < 24) {
				throw new Error(
					"Cannot cancel reservation less than 24 hours before start time",
				);
			}

			return await ReservationRepository.cancelReservation(
				reservationId,
				userId,
			);
		} catch (error) {
			console.error("Error cancelling reservation:", error);
			throw error;
		}
	},

	async getUpcomingReservations(userId: number): Promise<Reservation[]> {
		const upcomingReservations =
			await ReservationRepository.getUpcomingReservations(userId);
		for (const reservation of upcomingReservations) {
			if (
				!reservation.google_meet_link?.startsWith("https://meet.google.com/")
			) {
				console.warn(
					`Invalid Meet link for upcoming reservation ${reservation.id}`,
				);
			}
		}
		return upcomingReservations;
	},

	async checkReservationConflict(
		userId: number,
		slotId: number,
	): Promise<boolean> {
		const [rows] = await client.query<RowDataPacket[]>(
			`SELECT COUNT(*) as count
             FROM reservations r
             JOIN slot s1 ON r.slot_id = s1.id
             JOIN slot s2 ON s2.id = ?
             WHERE r.user_id = ?
             AND r.status != 'cancelled'
             AND ABS(TIMESTAMPDIFF(MINUTE, s1.start_time, s2.start_time)) < s1.duration`,
			[slotId, userId],
		);
		return (rows[0] as { count: number }).count > 0;
	},
};

export default ReservationActions;
