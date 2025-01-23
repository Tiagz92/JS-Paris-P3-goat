import DatabaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

class advertRepository {
	async readAll() {
		const [rows] = await DatabaseClient.query<Rows>("SELECT * FROM advert");
		return rows;
	}
}

export default new advertRepository();
