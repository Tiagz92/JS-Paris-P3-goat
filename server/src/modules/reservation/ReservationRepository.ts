import type { ResultSetHeader, RowDataPacket } from "mysql2";
import client from "../../../database/client";

interface Reservation extends RowDataPacket {
	id: number;
	user_id: number;
	start_time: Date;
	end_time: Date;
	google_meet_link: string;
}

export const ReservationRepository = {
	async create(reservation: {
		user_id: number;
		start_time: Date;
		end_time: Date;
		google_meet_link: string;
	}) {
		const query = `
      INSERT INTO reservations (user_id, start_time, end_time, google_meet_link)
      VALUES (?, ?, ?, ?)
    `;
		const values = [
			reservation.user_id,
			reservation.start_time,
			reservation.end_time,
			reservation.google_meet_link,
		];

		const [result] = await client.query<ResultSetHeader>(query, values);
		const [newReservation] = await client.query<Reservation[]>(
			"SELECT * FROM reservations WHERE id = ?",
			[result.insertId],
		);
		return newReservation[0];
	},

	async findById(id: number) {
		const query = "SELECT * FROM reservations WHERE id = ?";
		const [rows] = await client.query<Reservation[]>(query, [id]);
		return rows[0];
	},
};
