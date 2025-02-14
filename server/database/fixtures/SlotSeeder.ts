import type { Pool, RowDataPacket } from "mysql2/promise";
import logger from "../../src/utils/logger";
import { AbstractSeeder } from "./AbstractSeeder";
import { AdvertSeeder } from "./AdvertSeeder";
import { GoatSeeder } from "./GoatSeeder";

interface DBRow extends RowDataPacket {
	id: number;
	goat_id: number;
}

interface SlotData {
	start_at: string;
	duration: number;
	status: "available" | "reserved" | "cancelled";
	advert_id: number;
	goat_id: number;
	refName?: string;
}

export class SlotSeeder extends AbstractSeeder {
	constructor(db: Pool) {
		super({
			table: "slot",
			truncate: true,
			dependencies: [AdvertSeeder, GoatSeeder],
			db,
		});
	}

	async run(): Promise<void> {
		try {
			const [adverts] = await this.db.query<DBRow[]>(
				"SELECT id, goat_id FROM advert LIMIT 1",
			);
			if (!Array.isArray(adverts) || !adverts.length) {
				throw new Error("Need at least one advert to create slots");
			}

			const advertId = adverts[0].id;
			const goatId = adverts[0].goat_id;

			const dates = [new Date(), new Date(Date.now() + 24 * 60 * 60 * 1000)];

			for (const baseDate of dates) {
				for (let hour = 9; hour < 17; hour++) {
					const date = new Date(baseDate);
					date.setHours(hour, 0, 0, 0);

					this.insert<SlotData>({
						start_at: date.toISOString().slice(0, 19).replace("T", " "),
						duration: 60,
						status: "available",
						advert_id: advertId,
						goat_id: goatId,
					});
				}
			}

			await Promise.all(this.promises);
		} catch (error) {
			logger.error("Error seeding slots:", error);
			throw error;
		}
	}
}

export default SlotSeeder;
