import { createPool } from "mysql2/promise";
import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const NODE_ENV = process.env.NODE_ENV || "development";

const getDatabaseName = () => {
	if (NODE_ENV === "test") {
		return `${DB_NAME}`;
	}
	return DB_NAME;
};

const database = createPool({
	host: DB_HOST,
	port: Number.parseInt(DB_PORT as string, 10),
	user: DB_USER,
	password: DB_PASSWORD,
	database: getDatabaseName(),
	connectionLimit: 10,
});

export default database;

// ============ PARTIE TYPES ============

export type DatabaseClient = Pool;

export type DBResult<T = unknown> = T[];

// Ajout des types manquants
export type Result = DBResult;
export type Rows = RowDataPacket[];

export type DBRows = RowDataPacket[];

export type ClientType = typeof database;

// Types additionnels pour faciliter les imports
export { ResultSetHeader, RowDataPacket } from "mysql2/promise";
