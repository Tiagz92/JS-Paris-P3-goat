import DatabaseClient from "../../../database/client";
import type { RowDataPacket } from "../../../database/client";

interface MainTag {
	id: number;
	name: string;
}

// Interface pour le typage fort avec RowDataPacket
interface MainTagRow extends RowDataPacket, MainTag {}

class MainTagRepository {
	async read(id: number): Promise<MainTag | null> {
		const [rows] = await DatabaseClient.query<MainTagRow[]>(
			"SELECT * FROM main_tag WHERE id = ?",
			[id],
		);

		return rows.length > 0 ? rows[0] : null;
	}

	async readAll(): Promise<MainTag[]> {
		const [rows] = await DatabaseClient.query<MainTagRow[]>(
			"SELECT * FROM main_tag",
		);

		return rows;
	}
}

export default new MainTagRepository();
