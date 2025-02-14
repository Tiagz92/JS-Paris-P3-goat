import type { Request, Response } from "express";
import type { RequestHandler } from "express-serve-static-core";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import database from "../../../database/client";
import { sendBookingConfirmation } from "../../services/emailService";
import type { Reservation, ReservationDetails } from "../../types/models";
import { generateGoogleMeetLink } from "../../utils/googleMeet";
import { ReservationRepository } from "./ReservationRepository";

interface ReservationRow extends Reservation, RowDataPacket {}

type JsonResponse<T> = T | { message: string } | { error: string };

type CustomRequestHandler<
	P = Record<string, unknown>,
	ResBody = unknown,
	ReqBody = unknown,
> = (
	req: Request<P, ResBody, ReqBody>,
	res: Response<ResBody>,
) => Promise<Response>;

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
			const [slots] = await database.query<RowDataPacket[]>(
				"SELECT s.*, g.first_name as goat_firstname FROM slot s JOIN goat g ON s.goat_id = g.id WHERE s.id = ? AND s.status = 'available'",
				[slotId],
			);

			if (!Array.isArray(slots) || slots.length === 0) {
				throw new Error("Ce créneau n'est plus disponible");
			}

			const slot = slots[0];
			const startTime = new Date(slot.start_at);

			const meetLink = `https://meet.google.com/${Math.random().toString(36).substring(7)}`;

			const [result] = await database.query<ResultSetHeader>(
				"INSERT INTO reservations (slot_id, user_id, google_meet_link, status) VALUES (?, ?, ?, 'confirmed')",
				[slotId, userId, meetLink],
			);

			const reservation = {
				id: result.insertId,
				slot_id: slotId,
				user_id: userId,
				google_meet_link: meetLink,
			};

			await database.query(
				"UPDATE slot SET status = 'reserved', meet_link = ? WHERE id = ?",
				[meetLink, slotId],
			);

			const [userRows] = await database.query<RowDataPacket[]>(
				"SELECT email, first_name FROM goat WHERE id = ?",
				[userId],
			);

			if (userRows.length === 0) {
				throw new Error("Utilisateur non trouvé");
			}

			const reservationDetails: ReservationDetails = {
				id: reservation.id,
				slot_id: slotId,
				user_id: userId,
				google_meet_link: meetLink,
				date: startTime.toLocaleDateString(),
				time: startTime.toLocaleTimeString(),
				meetLink,
				goatName: userRows[0].first_name,
			};

			try {
				await sendBookingConfirmation(userRows[0].email, reservationDetails);
			} catch (emailError) {
				console.error("Erreur d'envoi d'email:", emailError);
			}

			return {
				insertId: 0,
				google_meet_link: meetLink,
				status: "confirmed",
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

			const [slotRows] = await database.query<RowDataPacket[]>(
				"SELECT start_at FROM slot WHERE id = ?",
				[reservation.slot_id],
			);

			if (slotRows.length === 0) {
				throw new Error("Slot not found");
			}

			const slot = slotRows[0];
			const startTime = new Date(slot.start_at);
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
		const [rows] = await database.query<RowDataPacket[]>(
			`SELECT COUNT(*) as count
             FROM reservations r
             JOIN slot s1 ON r.slot_id = s1.id
             JOIN slot s2 ON s2.id = ?
             WHERE r.user_id = ?
             AND r.status != 'cancelled'
             AND ABS(TIMESTAMPDIFF(MINUTE, s1.start_at, s2.start_at)) < s1.duration`,
			[slotId, userId],
		);
		return (rows[0] as { count: number }).count > 0;
	},
};

export default ReservationActions;
