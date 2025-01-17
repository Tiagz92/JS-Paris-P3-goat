import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

type Tag = {
	id: number;
	name: string;
};

class TagRepository {
	async readAllMainTag() {
		const [rows] = await databaseClient.query<Rows>("SELECT * FROM main_tag");
		return rows as Tag[];
	}

	async readSubTagByMainTagId(main_tag_id: number) {
		const [rows] = await databaseClient.query<Rows>(
			"SELECT * FROM sub_tag WHERE main_tag_id = ?",
			[main_tag_id],
		);
		return rows as Tag[];
	}
}

export default new TagRepository();
