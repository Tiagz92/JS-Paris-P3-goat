import type {
	FieldPacket,
	OkPacket,
	PoolConnection,
	ResultSetHeader,
	RowDataPacket,
} from "mysql2/promise";
import { TABLES } from "../../config/database";
import database from "../../database/client";
import { sendReservationConfirmation } from "../../services/emailService";
import { createGoogleMeetEvent } from "../../services/googleCalendar";
import type { Reservation } from "../../types/models";

export const ReservationRepository = {
	/**
	 * Crée une nouvelle réservation.
	 */
	async create(reservationData: {
		slot_id: number;
		user_id: number; // goat_id
		google_meet_link: string;
	}): Promise<Reservation> {
		try {
			// Vérifier la disponibilité du créneau
			const [slotCheck] = await database.query<RowDataPacket[]>(
				"SELECT * FROM slot WHERE id = ? AND status = 'available'",
				[reservationData.slot_id],
			);
			if (slotCheck.length === 0) {
				throw new Error("Slot not available");
			}

			// Créer la réservation
			const [result]: [ResultSetHeader, FieldPacket[]] = await database.query(
				"INSERT INTO reservations (slot_id, user_id, google_meet_link, status) VALUES (?, ?, ?, 'pending')",
				[
					reservationData.slot_id,
					reservationData.user_id,
					reservationData.google_meet_link,
				],
			);

			// Mettre à jour le statut du créneau
			await database.query("UPDATE slot SET status = 'reserved' WHERE id = ?", [
				reservationData.slot_id,
			]);

			// Récupérer la réservation créée
			const [newReservation] = await database.query<RowDataPacket[]>(
				"SELECT * FROM reservations WHERE id = ?",
				[result.insertId],
			);

			return newReservation[0] as Reservation;
		} catch (error) {
			console.error("Error creating reservation:", error);
			throw error;
		}
	},

	/**
	 * Récupère une réservation par son ID.
	 */
	async findById(id: number): Promise<Reservation | null> {
		const [rows]: [RowDataPacket[], FieldPacket[]] = await database.query(
			"SELECT r.*, s.start_at, s.duration, s.meet_link as slot_meet_link FROM reservations r JOIN slot s ON r.slot_id = s.id WHERE r.id = ?",
			[id],
		);
		return rows.length > 0 ? (rows[0] as Reservation) : null;
	},

	/**
	 * Récupère toutes les réservations d'un utilisateur.
	 */
	async getUserReservations(goatId: number): Promise<Reservation[]> {
		const [rows] = await database.query(
			`SELECT r.*, s.start_at, s.duration, s.meet_link as slot_meet_link
             FROM reservations r 
             JOIN slot s ON r.slot_id = s.id 
             WHERE r.user_id = ? 
             ORDER BY s.start_at DESC`,
			[goatId],
		);
		return rows as Reservation[];
	},

	/**
	 * Annule une réservation.
	 */
	async cancelReservation(id: number, goatId: number): Promise<boolean> {
		try {
			// Vérifier si la réservation existe et appartient à l'utilisateur
			const [reservationCheck]: [RowDataPacket[], FieldPacket[]] =
				await database.query(
					"SELECT * FROM reservations WHERE id = ? AND user_id = ?",
					[id, goatId],
				);
			if (reservationCheck.length === 0) {
				throw new Error("Reservation not found or unauthorized");
			}

			// Vérifier le délai d'annulation (24 heures avant le début)
			const [slotCheck]: [RowDataPacket[], FieldPacket[]] =
				await database.query(
					"SELECT start_at FROM slot WHERE id = (SELECT slot_id FROM reservations WHERE id = ?)",
					[id],
				);
			const startTime = new Date(slotCheck[0].start_at);
			const now = new Date();
			const hoursDifference =
				(startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
			if (hoursDifference < 24) {
				throw new Error(
					"Cannot cancel reservation less than 24 hours before start time",
				);
			}

			// Mettre à jour la réservation
			const [result]: [ResultSetHeader, FieldPacket[]] = await database.query(
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
		const [rows] = await database.query(
			`SELECT r.*, s.start_at, s.duration, s.meet_link as slot_meet_link
             FROM reservations r 
             JOIN slot s ON r.slot_id = s.id 
             WHERE r.user_id = ? 
               AND s.start_at > NOW() 
               AND r.status != 'cancelled' 
             ORDER BY s.start_at ASC`,
			[goatId],
		);
		return rows as Reservation[];
	},
};
