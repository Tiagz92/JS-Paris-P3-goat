import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

class MainTagRepository {
	async readAll() {
		const [mainTags] = await databaseClient.query<Rows>(
			"SELECT * FROM main_tag",
		);
		return mainTags;
	}
}

export default new MainTagRepository();
