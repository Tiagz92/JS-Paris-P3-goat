import DatabaseClient from "../../../database/client";
import type { RowDataPacket } from "../../../database/client";

// Interface pour définir la structure des publicités
interface Advert extends RowDataPacket {
	id: number;
	title: string;
	description?: string;
	// Ajoutez d'autres propriétés selon votre schéma de base de données
}

class AdvertRepository {
	async readAll(): Promise<Advert[]> {
		const [rows] = await DatabaseClient.query<Advert[]>("SELECT * FROM advert");
		return rows;
	}

	// Vous pouvez ajouter d'autres méthodes ici
	async findById(id: number): Promise<Advert | null> {
		const [rows] = await DatabaseClient.query<Advert[]>(
			"SELECT * FROM advert WHERE id = ?",
			[id],
		);
		return rows.length > 0 ? rows[0] : null;
	}
}

export default new AdvertRepository();
