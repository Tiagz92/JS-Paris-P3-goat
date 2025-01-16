import DatabaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

interface Goat {
	id: number;
	lastname: string;
	firstname: string;
	born_at: string;
	email: string;
	password: string;
	picture: string;
	presentation: string;
	video: string;
}

class goatRepository {
	async read(id: number) {
		const [[goat]] = await DatabaseClient.query<Rows>(
			"SELECT * FROM goat WHERE id = ?",
			[id],
		);

		return goat as Goat;
	}
}

export default new goatRepository();
