import type { RequestHandler } from "express";
import mainTagRepository from "./mainTagRepository";

const browse: RequestHandler = async (req, res, next) => {
	try {
		const mainTags = await mainTagRepository.readAll();
		res.json(mainTags);
	} catch (err) {
		next(err);
	}
};

export default { browse };
