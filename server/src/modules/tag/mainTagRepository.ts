import type { RowDataPacket } from "mysql2/promise";
import database from "../../../database/client";

class MainTagRepository {
	async readAll() {
		const [rows] = await database.query<RowDataPacket[]>(
			"SELECT * FROM main_tag",
		);
		return rows;
	}
}

export default new MainTagRepository();
