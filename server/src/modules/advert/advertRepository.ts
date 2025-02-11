import type { OkPacket, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import databaseClient from "../../../database/client";

type Advert = {
	id: number;
	description: string;
	goat_id: number;
	main_tag_id: number;
	sub_tag_id: number;
	goat_picture: string;
	goat_firstname: string;
	main_tag_name: string;
	sub_tag_name: string;
	goat_name: string;
};

class AdvertRepository {
	// Création d'une annonce : on utilise OkPacket pour récupérer insertId
	async createAdvert(advert: Advert): Promise<number> {
		const [result] = await databaseClient.query<OkPacket>(
			"INSERT INTO advert (description, goat_id, main_tag_id, sub_tag_id) VALUES (?, ?, ?, ?)",
			[
				advert.goat_picture,
				advert.goat_firstname,
				advert.goat_name,
				advert.main_tag_name,
				advert.sub_tag_name,
				advert.description,
			],
		);
		return result.insertId;
	}

	// Lecture d'une annonce par son identifiant
	async read(id: number): Promise<Advert | null> {
		const [rows] = await databaseClient.query<RowDataPacket[]>(
			"SELECT * FROM advert WHERE id = ?",
			[id],
		);
		return (rows[0] as Advert) || null;
	}

	// Lecture de toutes les annonces
	async readAll(): Promise<Advert[]> {
		const [rows] = await databaseClient.query<RowDataPacket[]>(
			"SELECT * FROM advert",
		);
		return rows as Advert[];
	}

	// Recherche de mots dans la description d'une annonce
	async searchDescription(query: string): Promise<string[]> {
		try {
			const [rows] = await databaseClient.query<RowDataPacket[]>(
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

	// Récupération des main tags
	async getMainTags(): Promise<{ id: number; name: string }[]> {
		try {
			const [rows] = await databaseClient.query<RowDataPacket[]>(
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

	// Recherche de main tags par nom
	async searchMainTagsByName(
		query: string,
	): Promise<{ id: number; name: string }[]> {
		try {
			const [rows] = await databaseClient.query<RowDataPacket[]>(
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

	// Recherche de sub tags par nom
	async searchSubTagsByName(
		query: string,
	): Promise<{ id: number; name: string }[]> {
		try {
			const [rows] = await databaseClient.query<RowDataPacket[]>(
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

	// Filtrage des annonces par main tag et sub tag
	async filterByTags(mainTagId: number, subTagId: number): Promise<Advert[]> {
		try {
			const [rows] = await databaseClient.query<RowDataPacket[]>(
				"SELECT * FROM advert WHERE main_tag_id = ? AND sub_tag_id = ?",
				[mainTagId, subTagId],
			);
			return rows as Advert[];
		} catch (error) {
			console.error("Erreur SQL lors de la filtration des annonces :", error);
			throw error;
		}
	}

	// Récupération des sous-tags associés à un main tag
	async takeSubTagsByMainTag(
		mainTagId: number,
	): Promise<{ id: number; name: string }[]> {
		try {
			const [rows] = await databaseClient.query<RowDataPacket[]>(
				"SELECT sub_tag.id, sub_tag.name FROM sub_tag JOIN main_sub_tag ON sub_tag.id = main_sub_tag.sub_tag_id WHERE main_sub_tag.main_tag_id = ?",
				[mainTagId],
			);
			return rows as { id: number; name: string }[];
		} catch (error) {
			console.error("Erreur SQL récupération des sous-tags:", error);
			throw error;
		}
	}

	async create(newAdvert: Advert) {
		const [result] = await databaseClient.query<ResultSetHeader>(
			"INSERT INTO adverts SET ?",
			[newAdvert],
		);
		return result.insertId;
	}
}

export default new AdvertRepository();
