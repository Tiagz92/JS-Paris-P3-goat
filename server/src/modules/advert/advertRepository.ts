import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";
import type { Advert } from "../../types/advert";
import type { Slot } from "../../types/slot";

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

	async createSlot(slot: Slot): Promise<number> {
		const [result] = await databaseClient.query<Result>(
			"INSERT INTO slot (start_at, duration, meet_link, comment, advert_id) VALUES (?, ?, ?, ?, ?)",
			[
				slot.start_at,
				slot.duration,
				slot.meet_link,
				slot.comment,
				slot.advert_id,
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

	async readConfirmationDetails(id: number): Promise<Advert | null> {
		const [rows] = await databaseClient.query<Rows>(
			"SELECT id, goat_id, main_tag_name, sub_tag_name, goat_firstname, description, date, time FROM advert WHERE id = ?",
			[id],
		);
		return (rows[0] as Advert) || null;
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
