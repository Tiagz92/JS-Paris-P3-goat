import mysql from "mysql2/promise";

const database = mysql.createPool({
	host: process.env.DB_HOST || "localhost",
	port: Number.parseInt(process.env.DB_PORT || "3306", 10),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

export default database;
