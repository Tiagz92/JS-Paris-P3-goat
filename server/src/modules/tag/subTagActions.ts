import type { RequestHandler } from "express";
import subTagRepository from "./subTagRepository";

const browseSubTagByMainTagId: RequestHandler = async (req, res, next) => {
	try {
		const subTags = await subTagRepository.readByMainTagId(
			Number(req.params.id),
		);
		res.json(subTags);
	} catch (err) {
		next(err);
	}
};

export default { browseSubTagByMainTagId };
