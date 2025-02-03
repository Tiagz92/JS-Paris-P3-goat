import DatabaseClient from "../../../database/client";
import type { RowDataPacket } from "../../../database/client";

// Interface pour définir la structure des chèvres
interface Goat extends RowDataPacket {
	id: number;
	name: string;
	breed?: string;
	age?: number;
	// Ajoutez d'autres propriétés selon votre schéma de base de données
}

class GoatRepository {
	async read(id: number): Promise<Goat | null> {
		const [rows] = await DatabaseClient.query<Goat[]>(
			"SELECT * FROM goat WHERE id = ?",
			[id],
		);

		return rows.length > 0 ? rows[0] : null;
	}
}

export default new GoatRepository();
