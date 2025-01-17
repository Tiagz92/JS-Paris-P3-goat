import type { RequestHandler } from "express";
import tagRepository from "./tagRepository";

const browseMainTag: RequestHandler = async (req, res, next) => {
	try {
		const mainTags = await tagRepository.readAllMainTag();
		res.json(mainTags);
	} catch (err) {
		next(err);
	}
};

const browseSubTagByMainTagId: RequestHandler = async (req, res, next) => {
	try {
		const subTags = await tagRepository.readSubTagByMainTagId(
			Number(req.params.id),
		);
		res.json(subTags);
	} catch (err) {
		next(err);
	}
};

export default { browseMainTag, browseSubTagByMainTagId };
