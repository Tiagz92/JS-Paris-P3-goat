import type { Pool } from "mysql2/promise";
import { AbstractSeeder } from "./AbstractSeeder";

export class GoatSeeder extends AbstractSeeder {
	constructor(db: Pool) {
		super({
			table: "goat",
			truncate: true,
			dependencies: [],
			db,
		});
	}

	async run(): Promise<void> {
		try {
			const goats = [
				{
					first_name: "John",
					last_name: "Doe",
					email: "john@example.com",
					password: "hashed_password",
					avatar: "default.jpg",
					presentation: "Je suis un développeur passionné",
					video: null,
					status: "active",
				},
				// Ajoutez d'autres goats si nécessaire
			];

			for (const goat of goats) {
				this.insert(goat);
			}

			await Promise.all(this.promises);
		} catch (error) {
			console.error("Error seeding goats:", error);
			throw error;
		}
	}
}

export default GoatSeeder;
