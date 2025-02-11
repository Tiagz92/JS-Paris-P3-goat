import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

interface MainTag {
	id: number;
	name: string;
}

class MainTagRepository {
	async read(id: number) {
		const [[rows]] = await databaseClient.query<Rows>(
			"SELECT * FROM main_tag WHERE id = ?",
			[id],
		);

		return rows.length > 0 ? rows[0] : null;
	}

	async readAll() {
		const [mainTags] = await databaseClient.query<Rows>(
			"SELECT * FROM main_tag",
		);
		return mainTags;
	}
}

export default new MainTagRepository();
