import type { RowDataPacket } from "mysql2";
import database from "../../../database/client";

interface MainTag extends RowDataPacket {
	id: number;
	name: string;
	subTags?: SubTag[];
}

interface SubTag {
	id: number;
	name: string;
	main_tag_id: number;
}

export const MainTagRepository = {
	async read(id: number): Promise<MainTag | null> {
		const [rows] = await database.query<MainTag[]>(
			"SELECT * FROM main_tag WHERE id = ?",
			[id],
		);
		return rows[0] || null;
	},

	async readAll(): Promise<MainTag[]> {
		const [rows] = await database.query<MainTag[]>(
			"SELECT * FROM main_tag ORDER BY name",
		);
		return rows;
	},
};

export default MainTagRepository;
