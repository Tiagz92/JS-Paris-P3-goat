import databaseClient from "../../../database/client";
import type { ResultSetHeader, RowDataPacket } from "../../../database/client";

type Item = {
	id: number;
	title: string;
	user_id: number;
};

// Interface pour le typage fort avec RowDataPacket
interface ItemRow extends RowDataPacket, Item {}

class ItemRepository {
	// The C of CRUD - Create operation
	async create(item: Omit<Item, "id">) {
		// Execute the SQL INSERT query to add a new item to the "item" table
		const [result] = await databaseClient.query<ResultSetHeader>(
			"insert into item (title, user_id) values (?, ?)",
			[item.title, item.user_id],
		);

		// Return the ID of the newly inserted item
		return result.insertId;
	}

	// The Rs of CRUD - Read operations
	async read(id: number): Promise<Item | null> {
		// Execute the SQL SELECT query to retrieve a specific item by its ID
		const [rows] = await databaseClient.query<ItemRow[]>(
			"select * from item where id = ?",
			[id],
		);

		// Return the first row of the result, which represents the item
		return rows.length > 0 ? rows[0] : null;
	}

	async readAll(): Promise<Item[]> {
		// Execute the SQL SELECT query to retrieve all items from the "item" table
		const [rows] = await databaseClient.query<ItemRow[]>("select * from item");

		// Return the array of items
		return rows;
	}

	// The U of CRUD - Update operation
	async update(item: Item): Promise<boolean> {
		const [result] = await databaseClient.query<ResultSetHeader>(
			"UPDATE item SET title = ?, user_id = ? WHERE id = ?",
			[item.title, item.user_id, item.id],
		);

		return result.affectedRows > 0;
	}

	// The D of CRUD - Delete operation
	async delete(id: number): Promise<boolean> {
		const [result] = await databaseClient.query<ResultSetHeader>(
			"DELETE FROM item WHERE id = ?",
			[id],
		);

		return result.affectedRows > 0;
	}
}

export default new ItemRepository();
