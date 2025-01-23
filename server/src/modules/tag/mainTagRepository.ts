import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

class MainTagRepository {
	async readAll() {
		const [mainTags] = await databaseClient.query<Rows>(
			"SELECT * FROM main_tag",
		);
		return mainTags;
	}

	async read(id: number) {
		const [[mainTag]] = await databaseClient.query<Rows>(
			"SELECT * FROM main_tag WHERE id = ?",
			[id],
		);
		return mainTag;
	}
}

export default new MainTagRepository();
