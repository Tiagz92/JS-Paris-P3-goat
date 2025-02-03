import type { ResultSetHeader, RowDataPacket } from "mysql2";
import client from "../../../database/client";

/**
 * Interface représentant une réservation telle qu'enregistrée en base.
 * On étend RowDataPacket pour que l'objet récupéré depuis mysql2
 * corresponde aux types attendus.
 */
export interface Reservation extends RowDataPacket {
	id: number;
	slot_id: number;
	user_id: number;
	start_at: Date;
	duration: number;
	google_meet_link: string;
	status: "pending" | "confirmed" | "cancelled" | "completed";
}

/**
 * Type d'entrée pour la création d'une réservation.
 * On inclut ici toutes les propriétés nécessaires.
 */
export type ReservationInput = {
	slot_id: number;
	user_id: number;
	start_at: Date;
	duration: number;
	google_meet_link?: string; // Optionnel, généré automatiquement si absent
};

export const ReservationRepository = {
	async create(input: ReservationInput): Promise<Reservation> {
		if (!input.google_meet_link) {
			input.google_meet_link = `https://meet.google.com/${Math.random()
				.toString(36)
				.substring(2, 15)}`;
		}

		// Insertion dans la base (la requête est adaptée à votre schéma)
		const [result] = await client.query<ResultSetHeader>(
			"INSERT INTO reservations (slot_id, user_id, start_at, duration, google_meet_link, status) VALUES (?, ?, ?, ?, ?, ?)",
			[
				input.slot_id,
				input.user_id,
				input.start_at,
				input.duration,
				input.google_meet_link,
				"confirmed",
			],
		);
		const insertId = result.insertId;
		// Récupération de la réservation créée
		const [rows] = await client.query<RowDataPacket[]>(
			"SELECT * FROM reservations WHERE id = ?",
			[insertId],
		);
		return rows[0] as Reservation;
	},

	async findById(id: number): Promise<Reservation | null> {
		const [rows] = await client.query<RowDataPacket[]>(
			"SELECT * FROM reservations WHERE id = ?",
			[id],
		);
		return rows[0] ? (rows[0] as Reservation) : null;
	},

	async getUserReservations(user_id: number): Promise<Reservation[]> {
		const [rows] = await client.query<RowDataPacket[]>(
			"SELECT * FROM reservations WHERE user_id = ?",
			[user_id],
		);
		return rows as Reservation[];
	},

	async cancelReservation(
		reservationId: number,
		userId: number,
	): Promise<boolean> {
		const [result] = await client.query<ResultSetHeader>(
			"UPDATE reservations SET status = 'cancelled' WHERE id = ? AND user_id = ?",
			[reservationId, userId],
		);
		return result.affectedRows > 0;
	},

	async getUpcomingReservations(user_id: number): Promise<Reservation[]> {
		const [rows] = await client.query<RowDataPacket[]>(
			"SELECT * FROM reservations WHERE user_id = ? AND start_at > NOW()",
			[user_id],
		);
		return rows as Reservation[];
	},
};
