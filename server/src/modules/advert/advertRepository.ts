import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Advert = {
	id: number;
	description: string;
	goat_id: number;
	main_tag_id: number;
	sub_tag_id: number;
	goat_firstname: string;
	goat_picture: string;
	main_tag_name: string;
	sub_tag_name: string;
};

class AdvertRepository {
	async createAdvert(advert: Advert) {
		const [result] = await databaseClient.query<Result>(
			"INSERT INTO advert (description, goat_id, main_tag_id, sub_tag_id) VALUES (?, ?, ?, ?)",
			[
				advert.description,
				advert.goat_id,
				advert.main_tag_id,
				advert.sub_tag_id,
			],
		);
		return result.insertId;
	}

	async read(id: number): Promise<Advert | null> {
		const [rows] = await databaseClient.query<Rows>(
			"SELECT * FROM advert WHERE id = ?",
			[id],
		);
		return (rows[0] as Advert) || null;
	}

	async readAll(): Promise<Advert[]> {
		const [rows] = await databaseClient.query<Rows>("SELECT * FROM advert");
		return rows as Advert[];
	}

	async searchDescription(query: string): Promise<string[]> {
		try {
			const [rows] = await databaseClient.query<Rows>(
				"SELECT description FROM advert WHERE description LIKE ?",
				[`%${query}%`],
			);

			const regex = new RegExp(`\\b${query}\\w*\\b`, "gi");
			const matchedWords: string[] = [];

			for (const row of rows) {
				const description = row.description;
				const matches = description.match(regex);
				if (matches) {
					matchedWords.push(...matches);
				}
			}

			return matchedWords;
		} catch (error) {
			console.error("Erreur SQL :", error);
			throw error;
		}
	}

	async getMainTags(): Promise<{ id: number; name: string }[]> {
		try {
			const [rows] = await databaseClient.query<Rows>(
				"SELECT id, name FROM main_tag",
			);
			return rows as { id: number; name: string }[];
		} catch (error) {
			console.error(
				"Erreur SQL lors de la récupération des main tags :",
				error,
			);
			throw error;
		}
	}

	async searchMainTagsByName(
		query: string,
	): Promise<{ id: number; name: string }[]> {
		try {
			const [rows] = await databaseClient.query<Rows>(
				"SELECT id, name FROM main_tag WHERE name LIKE ?",
				[`%${query}%`],
			);
			return rows as { id: number; name: string }[];
		} catch (error) {
			console.error(
				"Erreur SQL lors de la recherche de main tags par nom :",
				error,
			);
			throw error;
		}
	}

	async searchSubTagsByName(
		query: string,
	): Promise<{ id: number; name: string }[]> {
		try {
			const [rows] = await databaseClient.query<Rows>(
				"SELECT id, name FROM sub_tag WHERE name LIKE ?",
				[`%${query}%`],
			);
			return rows as { id: number; name: string }[];
		} catch (error) {
			console.error(
				"Erreur SQL lors de la recherche de sub tags par nom :",
				error,
			);
			throw error;
		}
	}

	async filterByTags(mainTagId: number, subTagId: number): Promise<Advert[]> {
		try {
			const [rows] = await databaseClient.query<Rows>(
				"SELECT * FROM advert WHERE main_tag_id = ? AND sub_tag_id = ?",
				[mainTagId, subTagId],
			);
			return rows as Advert[];
		} catch (error) {
			console.error("Erreur SQL lors de la filtration des annonces :", error);
			throw error;
		}
	}
	async getSubTagsByMainTag(mainTagId: number): Promise<string[]> {
		try {
			const [rows] = await databaseClient.query<Rows>(
				"SELECT name FROM sub_tag WHERE main_tag_id = ?",
				[mainTagId],
			);
			return rows.map((row) => row.name); // Retourner les sous-tags
		} catch (error) {
			console.error(
				"Erreur SQL lors de la récupération des sous-tags :",
				error,
			); // Log SQL
			throw error;
		}
	}
}

export default new AdvertRepository();
