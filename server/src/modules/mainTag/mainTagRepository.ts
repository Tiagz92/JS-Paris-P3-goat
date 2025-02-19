import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

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

		return rows as MainTag;
	}

	async readAll() {
		const [mainTags] = await databaseClient.query<Rows>(
			"SELECT * FROM main_tag",
		);

		return mainTags;
	}
}

export default MainTagRepository;
