import { faker } from "@faker-js/faker";
import type { Faker } from "@faker-js/faker";
import type { Pool } from "mysql2/promise";
import type { DBResult, ResultSetHeader } from "../client";

// Declare an object to store created objects from their names
type Ref = object & { insertId: number };
const refs: { [key: string]: Ref } = {};

export interface SeederOptions {
	table: string;
	truncate?: boolean;
	dependencies?: (new (dbPool: Pool) => AbstractSeeder)[];
}

// Provide faker access through AbstractSeed class
export abstract class AbstractSeeder implements SeederOptions {
	table: string;
	truncate: boolean;
	dependencies: (new (
		dbPool: Pool,
	) => AbstractSeeder)[];
	promises: Promise<void>[];
	faker: Faker;
	protected db: Pool;

	constructor({
		table,
		truncate = true,
		dependencies = [] as (new (
			dbPool: Pool,
		) => AbstractSeeder)[],
		db,
	}: SeederOptions & { db: Pool }) {
		if (!db) {
			throw new Error("Database connection is required");
		}
		this.table = table;
		this.truncate = truncate;
		this.dependencies = dependencies;
		this.promises = [];
		this.faker = faker;
		this.db = db;
	}

	async #doInsert(data: { refName?: string } & object) {
		// Extract ref name (if it exists)
		const { refName, ...values } = data;

		// Prepare the SQL statement: "insert into <table>(<fields>) values (<placeholders>)"
		const fields = Object.keys(values).join(",");
		const placeholders = new Array(Object.keys(values).length)
			.fill("?")
			.join(",");

		const sql = `insert into ${this.table}(${fields}) values (${placeholders})`;

		// Perform the query and if applicable store the insert id given the ref name
		const [result] = await this.db.query<ResultSetHeader>(
			sql,
			Object.values(values),
		);

		if (refName != null) {
			const { insertId } = result;
			refs[refName] = { ...values, insertId };
		}
	}

	protected insert<T extends object>(data: T & { refName?: string }): void {
		this.promises.push(this.#doInsert(data));
	}

	abstract run(): Promise<void>;

	getRef(name: string) {
		return refs[name];
	}
}
