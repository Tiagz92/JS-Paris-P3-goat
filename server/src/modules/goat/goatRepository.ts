import DatabaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

class goatRepository {
	async read(id: number) {
		const [[goat]] = await DatabaseClient.query<Rows>(
			"SELECT * FROM goat WHERE id = ?",
			[id],
		);

		return goat;
	}
}

export default new goatRepository();
