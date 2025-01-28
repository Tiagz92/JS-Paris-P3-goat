import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Advert = {
	id?: number;
	description: string;
	goat_id: number;
	main_tag_id: number;
	sub_tag_id: number;
	goat_picture: string;
	goat_firstname: string;
	main_tag_name: string;
	sub_tag_name: string;
	goat_name: string;
};

class AdvertRepository {
	async create(advert: Omit<Advert, "id">): Promise<number> {
		const [result] = await databaseClient.query<Result>(
			"INSERT INTO advert ( goat_picture, goat_firstname, goat_name, main_tag_name, sub_tag_name, description) VALUES (?, ?, ?, ?, ?, ?)",
			[
				advert.goat_picture,
				advert.goat_firstname,
				advert.goat_name,
				advert.main_tag_name,
				advert.sub_tag_name,
				advert.description,
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
