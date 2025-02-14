import type { Pool } from "mysql2/promise";
import { AbstractSeeder } from "./AbstractSeeder";

export class MainTagSeeder extends AbstractSeeder {
	constructor(db: Pool) {
		super({
			table: "main_tag",
			truncate: true,
			dependencies: [],
			db,
		});
	}

	async run(): Promise<void> {
		try {
			const mainTags = [
				{ name: "Développement" },
				{ name: "Design" },
				{ name: "Marketing" },
				{ name: "Business" },
			];

			for (const tag of mainTags) {
				this.insert(tag);
			}

			await Promise.all(this.promises);
		} catch (error) {
			console.error("Error seeding main tags:", error);
			throw error;
		}
	}
}

export default MainTagSeeder;
