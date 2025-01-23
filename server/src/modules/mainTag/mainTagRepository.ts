import DatabaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

interface MainTag {
	id: number;
	name: string;
}

class mainTagRepository {
	async read(id: number) {
		const [[rows]] = await DatabaseClient.query<Rows>(
			"SELECT * FROM main_tag WHERE id = ?",
			[id],
		);

		return rows as MainTag;
	}
}

export default new mainTagRepository();
