import type { RowDataPacket } from "mysql2/promise";
import databaseClient from "../../../database/client"; // Assurez-vous que le chemin d'importation est correct

class SearchbarRepository {
	async search(query: string) {
		// Recherche dans les main_tag et sub_tag où le texte commence par la valeur query
		const [rowsMainTags] = await databaseClient.query<RowDataPacket[]>(
			"SELECT name FROM main_tag WHERE name LIKE ?",
			[`${query}%`],
		);

		const [rowsSubTags] = await databaseClient.query<RowDataPacket[]>(
			"SELECT name FROM sub_tag WHERE name LIKE ?",
			[`${query}%`],
		);

		// Fusionner les résultats des main_tag et sub_tag
		const combinedResults = [
			...rowsMainTags.map((row: RowDataPacket) => row.name),
			...rowsSubTags.map((row: RowDataPacket) => row.name),
		];

		return combinedResults; // Retourne les résultats combinés
	}
}

export default new SearchbarRepository();
