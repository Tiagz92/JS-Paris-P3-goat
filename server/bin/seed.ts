import "dotenv/config";
import path from "node:path";
import database from "../database/client";
import { AdvertSeeder } from "../database/fixtures/AdvertSeeder";
import { GoatSeeder } from "../database/fixtures/GoatSeeder";
import { MainTagSeeder } from "../database/fixtures/MainTagSeeder";
import { ReservationSeeder } from "../database/fixtures/ReservationSeeder";
import { SlotSeeder } from "../database/fixtures/SlotSeeder";
import { SubTagSeeder } from "../database/fixtures/SubTagSeeder";
import type { Seeder } from "../src/types/seeder";

const seeders = [
	new MainTagSeeder(database),
	new SubTagSeeder(database),
	new GoatSeeder(database),
	new AdvertSeeder(database),
	new SlotSeeder(database),
	new ReservationSeeder(database),
];

const runSeeders = async () => {
	console.info("Running seeders...");
	try {
		for (const seeder of seeders) {
			await seeder.run();
		}
		console.info("Database filled with seed data");
		process.exit(0);
	} catch (error) {
		console.error("Error running seeders:", error);
		process.exit(1);
	} finally {
		await database.end();
	}
};

runSeeders();
