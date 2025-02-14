import {
	type FieldPacket,
	Pool,
	type ResultSetHeader,
	type RowDataPacket,
} from "mysql2/promise";
import database from "../../../database/client";
import { sendReservationConfirmation } from "../../services/emailService";
import { createGoogleMeetEvent } from "../../services/googleCalendar";
import type { Reservation } from "../../types/models";

interface ReservationRow extends Reservation, RowDataPacket {}

export const ReservationRepository = {
	/**
	 * Crée une nouvelle réservation.
	 */
	async create(reservation: {
		slot_id: number;
		user_id: number;
		google_meet_link: string;
	}): Promise<Reservation> {
		const [result] = await database.query<ResultSetHeader>(
			"INSERT INTO reservation (slot_id, user_id, google_meet_link, status) VALUES (?, ?, ?, 'confirmed')",
			[reservation.slot_id, reservation.user_id, reservation.google_meet_link],
		);
		return { id: result.insertId, ...reservation, status: "confirmed" };
	},

	/**
	 * Récupère une réservation par son ID.
	 */
	async findById(id: number): Promise<Reservation | null> {
		const [rows] = await database.query<ReservationRow[]>(
			"SELECT r.*, s.start_at, s.duration, s.meet_link as slot_meet_link FROM reservations r JOIN slot s ON r.slot_id = s.id WHERE r.id = ?",
			[id],
		);
		return rows.length > 0 ? rows[0] : null;
	},

	/**
	 * Récupère toutes les réservations d'un utilisateur.
	 */
	async getUserReservations(goatId: number): Promise<Reservation[]> {
		const [rows] = await database.query<ReservationRow[]>(
			"SELECT r.*, s.start_at, s.duration, s.meet_link as slot_meet_link FROM reservations r JOIN slot s ON r.slot_id = s.id WHERE r.user_id = ? ORDER BY s.start_at DESC",
			[goatId],
		);
		return rows;
	},

	/**
	 * Annule une réservation.
	 */
	async cancelReservation(id: number, goatId: number): Promise<boolean> {
		try {
			// Vérifier si la réservation existe et appartient à l'utilisateur
			const [reservationCheck] = await database.query<ReservationRow[]>(
				"SELECT * FROM reservations WHERE id = ? AND user_id = ?",
				[id, goatId],
			);
			if (reservationCheck.length === 0) {
				throw new Error("Reservation not found or unauthorized");
			}

			// Vérifier le délai d'annulation
			const [slotCheck] = await database.query<ReservationRow[]>(
				"SELECT start_at FROM slot WHERE id = (SELECT slot_id FROM reservations WHERE id = ?)",
				[id],
			);
			const startTime = slotCheck[0]?.start_at
				? new Date(slotCheck[0].start_at)
				: new Date();
			const now = new Date();
			const hoursDifference =
				(startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
			if (hoursDifference < 24) {
				throw new Error(
					"Cannot cancel reservation less than 24 hours before start time",
				);
			}

			// Mettre à jour la réservation
			const [result] = await database.query<ResultSetHeader>(
				"UPDATE reservations SET status = 'cancelled' WHERE id = ?",
				[id],
			);

			if (result.affectedRows > 0) {
				// Libérer le créneau
				await database.query(
					"UPDATE slot s JOIN reservations r ON s.id = r.slot_id SET s.status = 'available' WHERE r.id = ?",
					[id],
				);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error cancelling reservation:", error);
			throw error;
		}
	},

	/**
	 * Récupère les prochaines réservations d'un utilisateur.
	 */
	async getUpcomingReservations(goatId: number): Promise<Reservation[]> {
		const [rows] = await database.query<ReservationRow[]>(
			"SELECT r.*, s.start_at, s.duration, s.meet_link as slot_meet_link FROM reservations r JOIN slot s ON r.slot_id = s.id WHERE r.user_id = ? AND s.start_at > NOW() AND r.status != 'cancelled' ORDER BY s.start_at ASC",
			[goatId],
		);
		return rows;
	},

	async findByUser(userId: number): Promise<Reservation[]> {
		const [rows] = await database.query<ReservationRow[]>(
			"SELECT * FROM reservation WHERE user_id = ?",
			[userId],
		);
		return rows;
	},
};
