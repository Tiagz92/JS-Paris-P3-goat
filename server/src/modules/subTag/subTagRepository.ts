import DatabaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

interface SubTag {
	id: number;
	name: string;
}

class subTagRepository {
	async read(id: number) {
		const [[rows]] = await DatabaseClient.query<Rows>(
			"SELECT * FROM sub_tag WHERE id = ?",
			[id],
		);

		return rows as SubTag;
	}
}

export default new subTagRepository();
