import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import database from "../database/client";
import type { AbstractSeeder } from "../database/fixtures/AbstractSeeder";

const fixturesPath = path.join(__dirname, "../database/fixtures");

const seed = async () => {
	try {
		const dependencyMap: { [key: string]: AbstractSeeder } = {};
		// Lire tous les fichiers de seeders
		const filePaths = fs
			.readdirSync(fixturesPath)
			.filter((filePath: string) => !filePath.startsWith("Abstract"));

		for (const filePath of filePaths) {
			console.info(`Loading seeder from file: ${filePath}`);
			const { default: SeederClass } = await import(
				`file://${path.join(fixturesPath, filePath.replace(".ts", ".js"))}`
			);
			console.info("SeederClass loaded:", SeederClass);
			const seeder = new SeederClass() as AbstractSeeder;
			dependencyMap[SeederClass.toString()] = seeder;
		}

		// Résoudre les dépendances
		const sortedSeeders: AbstractSeeder[] = [];
		const solveDependencies = (n: AbstractSeeder) => {
			for (const DependencyClass of n.dependencies) {
				const dependency = dependencyMap[DependencyClass.toString()];
				if (!sortedSeeders.includes(dependency)) {
					solveDependencies(dependency);
				}
			}
			if (!sortedSeeders.includes(n)) {
				sortedSeeders.push(n);
			}
		};

		for (const seeder of Object.values(dependencyMap)) {
			solveDependencies(seeder);
		}

		// Tronquer les tables
		for (const seeder of sortedSeeders.toReversed()) {
			await database.query(`delete from ${seeder.table}`);
		}

		// Exécuter les seeders
		for (const seeder of sortedSeeders) {
			await seeder.run();
			await Promise.all(seeder.promises);
		}

		// Fermer la connexion à la base de données
		database.end();
		console.info(
			`${process.env.DB_NAME} filled from '${path.normalize(fixturesPath)}' 🌱`,
		);
	} catch (err) {
		const { message, stack } = err as Error;
		console.error("Error filling the database:", message, stack);
	}
};

seed();
