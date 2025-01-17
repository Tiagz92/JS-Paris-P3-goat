import DatabaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

interface SubTag {
	id: number;
	name: string;
}

class subTagRepository {
	async readAll(id: number) {
		const [rows] = await DatabaseClient.query<Rows>("select * from sub_tag");

		return rows;
	}
}

export default new subTagRepository();
