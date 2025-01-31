import DatabaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

interface Advert {
	id: number;
	description: string;
	goat_id: number;
	main_tag_id: number;
	sub_tag_id: number;
}

class AdvertRepository {
	async createAdvert(advert: Advert) {
		const [result] = await DatabaseClient.query<Result>(
			"INSERT INTO advert (description, goat_id, main_tag_id, sub_tag_id) VALUES (?, ?, ?, ?)",
			[
				advert.description,
				advert.goat_id,
				advert.main_tag_id,
				advert.sub_tag_id,
			],
		);
		return result.insertId;
	}

	async readAll() {
		const [rows] = await DatabaseClient.query<Rows>("SELECT * FROM advert");
		return rows;
	}

	async updateAdvert(advert: Advert) {
		const [result] = await DatabaseClient.query<Result>(
			"UPDATE advert SET ? WHERE id = ?",
			[advert, advert.id],
		);
	}
}

export default new AdvertRepository();
