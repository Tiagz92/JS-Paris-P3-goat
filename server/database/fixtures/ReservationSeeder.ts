import type { Pool } from "mysql2/promise";
import logger from "../../src/utils/logger";
import { AbstractSeeder } from "./AbstractSeeder";
import { GoatSeeder } from "./GoatSeeder";
import { SlotSeeder } from "./SlotSeeder";

export class ReservationSeeder extends AbstractSeeder {
	constructor(db: Pool) {
		super({
			table: "reservations",
			truncate: true,
			dependencies: [SlotSeeder, GoatSeeder],
			db,
		});
	}

	async run(): Promise<void> {
		try {
			logger.info(
				"Skipping reservation seeding - all slots are available by default",
			);
			return;
		} catch (error) {
			logger.error("Error seeding reservations:", error);
			throw error;
		}
	}
}

export default ReservationSeeder;
