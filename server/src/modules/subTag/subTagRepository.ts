import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

interface SubTag {
	id: number;
	name: string;
}

class subTagRepository {
	async read(id: number) {
		const [[rows]] = await databaseClient.query<Rows>(
			"SELECT * FROM sub_tag WHERE id = ?",
			[id],
		);

		return rows as SubTag;
	}
	async readAllByMainTag(mainTagId: number) {
		const [subTags] = await databaseClient.query<Rows>(
			"SELECT * FROM sub_tag st JOIN main_sub_tag mst ON mst.sub_tag_id = st.id WHERE mst.main_tag_id = ?",
			[mainTagId],
		);
		return subTags;
	}
}

export default new subTagRepository();
