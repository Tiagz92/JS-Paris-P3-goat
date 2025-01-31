import DatabaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

interface Goat {
	id: number;
	lastname: string;
	firstname: string;
	birthday: Date;
	email: string;
	password: string;
	picture: string;
	presentation: string;
	video: string | null;
}

class goatRepository {
	async read(id: number) {
		const [[goat]] = await DatabaseClient.query<Rows>(
			"SELECT * FROM goat WHERE id = ?",
			[id],
		);

		return goat;
	}

	async createGoat(goat: Goat) {
		const [result] = await DatabaseClient.query<Result>(
			"INSERT INTO goat (lastname, firstname, born_at, email, password, picture, video) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[
				goat.lastname,
				goat.firstname,
				goat.birthday,
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

export default new goatRepository();
