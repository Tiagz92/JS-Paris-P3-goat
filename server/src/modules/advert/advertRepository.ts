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
	goat_name: string;
}

class AdvertRepository {
	async read(id: number): Promise<AdvertWithDetails | null> {
		const [rows] = await database.query<AdvertWithDetails[]>(
			`SELECT a.*, 
			 g.picture as goat_picture, 
			 g.first_name as goat_firstname,
			 mt.name as main_tag_name,
			 st.name as sub_tag_name
			 FROM advert a
			 JOIN goat g ON a.goat_id = g.id
			 JOIN main_tag mt ON a.main_tag_id = mt.id
			 JOIN sub_tag st ON a.sub_tag_id = st.id
			 WHERE a.id = ?`,
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
