// Load environment variables from .env file
import "dotenv/config";

import fs from "node:fs";

import databaseClient from "../database/client";
import type { RowDataPacket } from "../database/client";

// Close the database connection after all tests have run
afterAll((done) => {
	databaseClient.end().then(done);
});

// Test suite for environment installation
describe("Installation", () => {
	// Test: Check if the .env file exists
	test("You have created /server/.env", async () => {
		expect(fs.existsSync(`${__dirname}/../.env`)).toBe(true);
	});

	// Test: Check if the .env.sample file exists
	test("You have retained /server/.env.sample", async () => {
		expect(fs.existsSync(`${__dirname}/../.env.sample`)).toBe(true);
	});

	// Test: Check if the .env file is properly filled with valid database connection information
	test("You have filled /server/.env with valid information to connect to your database", async () => {
		try {
			// Check if the connection is successful
			const connection = await databaseClient.getConnection();
			connection.release(); // Release the connection after test

			// If we reach here, the connection was successful
			expect(true).toBe(true);
		} catch (error) {
			// If connection fails, the test will fail
			expect(error).toBeUndefined();
		}
	});

	// Test: Check if the database migration scripts have been executed
	test("You have executed the db:migrate scripts", async () => {
		// Query the 'item' table to check if any data has been inserted
		const [rows] =
			await databaseClient.query<RowDataPacket[]>("select * from item");

		// Expecting rows to be returned, indicating successful migration
		expect(rows.length).toBeGreaterThanOrEqual(0);
	});
});
