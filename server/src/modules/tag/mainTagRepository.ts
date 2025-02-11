import type { RowDataPacket } from "mysql2/promise";
import client from "../../../database/client";

class MainTagRepository {
	async readAll() {
		const [rows] = await client.query<RowDataPacket[]>(
			"SELECT * FROM main_tag",
		);
		return rows;
	}
}

export default new MainTagRepository();
