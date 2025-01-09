// import client from "../../../database/client";
// import type { Result, Rows } from "../../../database/client";

// interface mainTag {
// 	id: number;
// 	name: string;
// }

// interface subTag {
// 	id: number;
// 	name: string;
// 	main_tag_id: number;
// }

// const getTags = async (): Promise<mainTag[]>=> {
// 	const result = await client.query<mainTag>("SELECT * FROM main_tag;");
// 	return result.rows;
// }

// const getOneTag = async (id: number): Promise<mainTag | null> => {
// 	  const result = await client.query<mainTag>("SELECT * FROM main_tag WHERE id = $1;", [id]);
// 	  return result.rows[0] || null;}

// export default { getTags, getOneTag };
