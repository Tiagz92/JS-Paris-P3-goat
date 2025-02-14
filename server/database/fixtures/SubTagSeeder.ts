import type { Pool, RowDataPacket } from "mysql2/promise";
import logger from "../../src/utils/logger";
import { AbstractSeeder } from "./AbstractSeeder";
import { MainTagSeeder } from "./MainTagSeeder";

interface DBRow extends RowDataPacket {
	id: number;
}

export class SubTagSeeder extends AbstractSeeder {
	constructor(db: Pool) {
		super({
			table: "sub_tag",
			truncate: true,
			dependencies: [MainTagSeeder],
			db,
		});
	}

	async run(): Promise<void> {
		try {
			const [mainTags] = await this.db.query<DBRow[]>(
				"SELECT id FROM main_tag LIMIT 1",
			);
			if (!Array.isArray(mainTags) || !mainTags.length) {
				throw new Error("Need at least one main tag");
			}

			const mainTagId = mainTags[0].id;

			const subTags = [
				{ name: "JavaScript", main_tag_id: mainTagId },
				{ name: "Python", main_tag_id: mainTagId },
				{ name: "UI/UX", main_tag_id: mainTagId },
				{ name: "SEO", main_tag_id: mainTagId },
			];

			for (const tag of subTags) {
				this.insert(tag);
			}

			await Promise.all(this.promises);
		} catch (error) {
			logger.error("Error seeding sub tags:", error);
			throw error;
		}
	}
}

export default SubTagSeeder;
