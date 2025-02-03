import type { RowDataPacket } from "mysql2";
import client from "../../../database/client";
import { ReservationRepository } from "./ReservationRepository";
import type { Reservation } from "./ReservationRepository";

// On omet la propriété "constructor" pour éviter les problèmes liés à RowDataPacket.
interface ReservationResponse
	extends Omit<Partial<Reservation>, "constructor"> {
	id: number;
	google_meet_link: string;
	status: "pending" | "confirmed" | "cancelled" | "completed" | undefined;
}

export const ReservationActions = {
	async createReservation(
		goatId: number,
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

			// Création de la réservation en passant start_at et duration
			const reservation = await ReservationRepository.create({
				slot_id: slotId,
				user_id: goatId,
				start_at: startTime,
				duration: slot.duration,
			});

			return {
				id: reservation.id,
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

	async getUserReservations(goatId: number): Promise<Reservation[]> {
		const reservations =
			await ReservationRepository.getUserReservations(goatId);

		// Validation optionnelle du lien Meet
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
		goatId: number,
		reservationId: number,
	): Promise<boolean> {
		try {
			// Vérifier que la réservation existe et appartient au goat
			const reservation = await this.getReservationById(reservationId);

			if (reservation.user_id !== goatId) {
				throw new Error("Unauthorized");
			}

			// Vérifier le délai d'annulation en récupérant l'heure de début du créneau
			const [slotRows] = await client.query<RowDataPacket[]>(
				"SELECT start_time FROM slot WHERE id = ?",
				[reservation.slot_id],
			);

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

			// Annuler la réservation
			return await ReservationRepository.cancelReservation(
				reservationId,
				goatId,
			);
		} catch (error) {
			console.error("Error cancelling reservation:", error);
			throw error;
		}
	},

	async getUpcomingReservations(goatId: number): Promise<Reservation[]> {
		const upcomingReservations =
			await ReservationRepository.getUpcomingReservations(goatId);

		// Validation optionnelle du lien Meet
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
		goatId: number,
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
			[slotId, goatId],
		);

		return (rows[0] as { count: number }).count > 0;
	},
};
