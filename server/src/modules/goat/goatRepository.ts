import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import database from "../../../database/client";
import type { Goat } from "../../types/models";

export interface NewGoat {
	first_name: string;
	name: string;
	email: string;
	password: string;
	picture: string;
	presentation: string;
	video: string | null;
}

class GoatRepository {
	async read(id: number): Promise<Goat | null> {
		const [rows] = await database.query<RowDataPacket[]>(
			"SELECT * FROM goat WHERE id = ?",
			[id],
		);
		return rows.length > 0 ? (rows[0] as Goat) : null;
	}

	async createGoat(goatData: NewGoat): Promise<number> {
		const [result] = await database.query<ResultSetHeader>(
			"INSERT INTO goat (first_name, name, email, password, picture, presentation, video) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[
				goatData.first_name,
				goatData.name,
				goatData.email,
				goatData.password,
				goatData.picture,
				goatData.presentation,
				goatData.video,
			],
		);
		return result.insertId;
	}

	async readUserByEmail(email: string) {
		return databaseClient.query<Rows>("SELECT * From goat WHERE email = ?", [
			email,
		]);
	}
}

export default new GoatRepository();
