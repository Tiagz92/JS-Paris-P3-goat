import type { Pool } from "mysql2/promise";

export interface Seeder {
	db: Pool;
	run(): Promise<void>;
}
