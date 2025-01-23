import type { RequestHandler } from "express";
import subTagRepository from "./subTagRepository";

const browse: RequestHandler = async (req, res, next) => {
	try {
		const mainTagId = req.query.id;

		if (!mainTagId) {
			res.sendStatus(400);
		}

		const subTags = await subTagRepository.readAllByMainTag(
			Number(req.params.id),
		);
		res.json(subTags);
	} catch (err) {
		next(err);
	}
};

export default { browse };
