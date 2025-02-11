import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import database from "../../database/client";
import type { Goat } from "../../types/models";

class GoatRepository {
	async read(id: number): Promise<Goat | null> {
		const [rows] = await database.query<RowDataPacket[]>(
			"SELECT * FROM goat WHERE id = ?",
			[id],
		);
		return rows.length > 0 ? (rows[0] as Goat) : null;
	}

	async createGoat(goat: {
		lastname: string;
		firstname: string;
		born_at: Date;
		email: string;
		password: string;
		picture: string;
		presentation: string;
		video: string | null;
	}): Promise<number> {
		const [result] = await database.query<ResultSetHeader>(
			"INSERT INTO goat (lastname, firstname, born_at, email, password, picture, presentation, video) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			[
				goat.lastname,
				goat.firstname,
				goat.born_at,
				goat.email,
				goat.password,
				goat.picture,
				goat.presentation,
				goat.video,
			],
		);
		return result.insertId;
	}
}

export default new GoatRepository();
