import DatabaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

interface Advert {
	id: number;
	description: string;
	goat_id: number;
	main_tag_id: number;
	sub_tag_id: number;
}

class advertRepository {
	async readAll() {
		const [rows] = await DatabaseClient.query<Rows>("select * from advert");

		return rows as Advert[];
	}
}

export default new advertRepository();
