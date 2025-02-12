import type { RequestHandler } from "express";
import mainTagRepository from "./mainTagRepository";
import subTagRepository from "../subTag/subTagRepository";


const browse: RequestHandler = async (req, res, next) => {
	try {
		const mainTags = await mainTagRepository.readAll();

		for (const mainTag of mainTags) {
			mainTag.subTags = await subTagRepository.readAllByMainTag(mainTag.id);
		}

		res.json(mainTags);
	} catch (err) {
		next(err);
	}
};

export default { browse };
