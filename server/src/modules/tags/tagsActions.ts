// import type { Request, Response } from "express";
// import tagsRepository from "/tags/tagsRepository.ts";
// import { mainTag } from "/tags/tagsRepository.ts";

// // const id = Number(request.params.id);
// // if (isNaN(id)) {
// // 	return response.sendStatus(400).json({ error: "Invalid ID" });
// // }

// // const getTags = async (request : Request, response : Response) => {
// // 	try {
// // 		const tags = await tagsRepository.getTags();
// // 		response.json(tags);
// // 	}catch(error){
// // 		console.error(error);
// // 		response.sendStatus(500);
// //  	}
// // };
// // const getOneTag = async (request : Request, response : Response) => {
// // 	try {
// // 		const  id  = Number(request.params.id);
// // 		if (Number.isNaN(id)) {
// // 			return response.sendStatus(400);
// // 		}
// // 		const tag = await tagsRepository.getOneTag(id);
// //   response.json(tag);
// // } else {
// //   response.sendStatus(404);
// // 	}
// // };

// export default { getTags, getOneTag };
