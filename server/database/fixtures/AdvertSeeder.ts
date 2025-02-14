import type { Pool, RowDataPacket } from "mysql2/promise";
import logger from "../../src/utils/logger";
import { AbstractSeeder } from "./AbstractSeeder";
import { GoatSeeder } from "./GoatSeeder";
import { MainTagSeeder } from "./MainTagSeeder";
import { SubTagSeeder } from "./SubTagSeeder";

interface DBRow extends RowDataPacket {
	id: number;
}

export class AdvertSeeder extends AbstractSeeder {
	constructor(db: Pool) {
		super({
			table: "advert",
			truncate: true,
			dependencies: [MainTagSeeder, SubTagSeeder, GoatSeeder],
			db,
		});
	}

	async run(): Promise<void> {
		try {
			const [goats] = await this.db.query<DBRow[]>(
				"SELECT id FROM goat LIMIT 1",
			);
			const [mainTags] = await this.db.query<DBRow[]>(
				"SELECT id FROM main_tag LIMIT 1",
			);
			const [subTags] = await this.db.query<DBRow[]>(
				"SELECT id FROM sub_tag LIMIT 1",
			);

			if (
				!Array.isArray(goats) ||
				!goats.length ||
				!Array.isArray(mainTags) ||
				!mainTags.length ||
				!Array.isArray(subTags) ||
				!subTags.length
			) {
				throw new Error(
					"Need at least one goat, main_tag and sub_tag to create adverts",
				);
			}

			const adverts = [
				{
					description: "Consultation JavaScript avec expert",
					goat_id: goats[0].id,
					main_tag_id: mainTags[0].id,
					sub_tag_id: subTags[0].id,
					status: "active",
				},
			];

			for (const advert of adverts) {
				this.insert(advert);
			}

			await Promise.all(this.promises);
		} catch (error) {
			logger.error("Error seeding adverts:", error);
			throw error;
		}
	}
}

export default AdvertSeeder;
