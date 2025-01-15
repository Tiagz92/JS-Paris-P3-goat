import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Advert = {
	id: number;
	description: string;
	goat_id: number;
	main_tag_id: number;
	sub_tag_id: number;
};

class AdvertRepository {
	async create(advert: Omit<Advert, "id">): Promise<number> {
		const [result] = await databaseClient.query<Result>(
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

	async read(id: number): Promise<Advert | null> {
		const [rows] = await databaseClient.query<Rows>(
			"SELECT * FROM advert WHERE id = ?",
			[id],
		);
		return (rows[0] as Advert) || null;
	}

	async readAll(): Promise<Advert[]> {
		const [rows] = await databaseClient.query<Rows>("SELECT * FROM advert");
		return rows as Advert[];
	}

	// methode uptade et delete a faire plus tard
}

export default new AdvertRepository();
