import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";
import "dotenv/config";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const targetDbName = DB_NAME; // Adaptez si nécessaire

// Construction du chemin vers le fichier SQL contenant le schéma
const schema = path.join(__dirname, "../schema.sql");

const migrate = async () => {
	try {
		console.info("Starting migration...");

		// Afficher les variables d'environnement (attention aux infos sensibles)
		console.info({
			DB_HOST,
			DB_PORT,
			DB_USER,
			DB_PASSWORD,
			DB_NAME,
			targetDbName,
		});

		console.info("Reading schema file...");
		const sql = fs.readFileSync(schema, "utf8");
		console.info("Schema file loaded successfully.");

		console.info("Connecting to the database...");
		const database = await mysql.createConnection({
			host: DB_HOST,
			port: DB_PORT ? Number(DB_PORT) : 3306,
			user: DB_USER,
			password: DB_PASSWORD,
			multipleStatements: true,
		});
		console.info("Database connection established.");

		console.info("Dropping existing database...");
		await database.query(`DROP DATABASE IF EXISTS \`${targetDbName}\``);

		console.info("Creating new database...");
		await database.query(`CREATE DATABASE \`${targetDbName}\``);

		console.info("Switching to new database...");
		await database.query(`USE \`${targetDbName}\``);

		console.info("Executing schema SQL...");
		await database.query(sql);

		console.info("Migration completed successfully.");
		await database.end();
	} catch (error) {
		console.error("Migration failed:", error);
		process.exit(1);
	}
};

migrate();
