import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";

type Slot = {
	id: number;
	start_at: string;
	duration: number;
	meet_link: string;
	comment: string;
	advert_id: number;
	goat_id: number;
};

class slotRepository {
	async create(slot: Slot) {
		const [result] = await databaseClient.query<Result>("INSERT INTO slot (start_at, advert_id) VALUES (?, ?)", [
            slot.start_at,
            slot.advert_id,
        ],);
        return result.insertId;
	}
}

export default new slotRepository();
