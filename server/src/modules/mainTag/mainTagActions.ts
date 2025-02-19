import type { RequestHandler } from "express";
import subTagRepository from "../subTag/subTagRepository";
import mainTagRepository from "./mainTagRepository";

const browse: RequestHandler = async (req, res, next) => {
	try {
		const mainTags = await mainTagRepository.readAll();

		for (const mainTag of mainTags) {
			const subTags = await subTagRepository.readAllByMainTag(mainTag.id);
			mainTag.subTags = subTags as SubTag[];
		}

		return res.json(mainTags);
	} catch (err) {
		return res.status(500).json({ error: "Error fetching main tags" });
	}
};

export const mainTagHandlers = {
	browse,
};
