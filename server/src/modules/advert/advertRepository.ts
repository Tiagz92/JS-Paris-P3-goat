import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import database from "../../../database/client";

export interface NewAdvert {
	description: string;
	goat_id: number;
	main_tag_id: number;
	sub_tag_id: number;
}

export interface Advert extends RowDataPacket, NewAdvert {
	id: number;
	status: string;
}

export interface AdvertWithDetails extends Advert {
	goat_picture: string;
	goat_firstname: string;
	main_tag_name: string;
	sub_tag_name: string;
}

class AdvertRepository {
	async create(advert: Omit<Advert, "id">): Promise<number> {
		const goatId = advert.goat_id;
		const mainTagId = advert.main_tag_id;
		const subTagId = advert.sub_tag_id;

		if (!goatId || !mainTagId || !subTagId) {
			throw new Error("Goat, main_tag, or sub_tag id is missing");
		}

		const [result] = await databaseClient.query<Result>(
			"INSERT INTO advert (goat_id, main_tag_id, sub_tag_id, description) VALUES (?, ?, ?, ?)",
			[goatId, mainTagId, subTagId, advert.description],
		);

		return result.insertId;
	}

	async read(id: number): Promise<Advert | null> {
		const [rows] = await databaseClient.query<Rows>(
			"SELECT * FROM advert WHERE id = ?",
			[id],
		);
		return rows[0] || null;
	}

	async readAll(): Promise<Advert[]> {
		const [rows] = await database.query<Advert[]>("SELECT * FROM advert");
		return rows;
	}

	async create(newAdvert: NewAdvert) {
		const [result] = await database.query<ResultSetHeader>(
			"INSERT INTO advert (description, goat_id, main_tag_id, sub_tag_id, status) VALUES (?, ?, ?, ?, 'active')",
			[
				newAdvert.description,
				newAdvert.goat_id,
				newAdvert.main_tag_id,
				newAdvert.sub_tag_id,
			],
		);
		return result.insertId;
	}
}

export default new AdvertRepository();
