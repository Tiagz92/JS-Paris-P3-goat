import type { RequestHandler } from "express";
import type { NextFunction, Request, Response } from "express";
import goatRepository from "../goat/goatRepository";
import mainTagRepository from "../mainTag/mainTagRepository";
import subTagRepository from "../subTag/subTagRepository";
import advertRepository from "./advertRepository";

const browse: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const adverts = await advertRepository.readAll();

		for (const advert of adverts) {
			const goat = await goatRepository.read(advert.goat_id);

			if (!goat) {
				res.sendStatus(404);
			}

			advert.goat_firstname = goat.firstname;
			advert.goat_picture = goat.picture;

			const mainTag = await mainTagRepository.read(advert.main_tag_id);

			if (!mainTag) {
				res.sendStatus(404);
			}

			advert.main_tag_name = mainTag.name;

			const subTag = await subTagRepository.read(advert.sub_tag_id);

			if (!subTag) {
				res.sendStatus(404);
			}

			advert.sub_tag_name = subTag.name;
		}

		res.json(adverts);
	} catch (err) {
		next(err);
	}
};
const read: RequestHandler = async (req, res, next) => {
	try {
		const advertId = Number(req.params.id);
		const advert = await advertRepository.read(advertId);
		if (advert == null) {
			res.sendStatus(404);
		} else {
			const goat = await goatRepository.read(advert.goat_id);
			if (!goat) {
				res.sendStatus(404);
			}
			advert.goat_firstname = goat.firstname;
			advert.goat_picture = goat.picture;
			const mainTag = await mainTagRepository.read(advert.main_tag_id);
			if (!mainTag) {
				res.sendStatus(404);
			}
			advert.main_tag_name = mainTag.name;
			const subTag = await subTagRepository.read(advert.sub_tag_id);
			if (!subTag) {
				res.sendStatus(404);
			}
			advert.sub_tag_name = subTag.name;
			res.json(advert);
		}
	} catch (err) {
		next(err);
	}
};

const add: RequestHandler = async (req: Request, res: Response, next) => {
	try {
		const newAdvert = {
			goat_id: req.body.goat_id,
			main_tag_id: req.body.main_tag_id,
			sub_tag_id: req.body.sub_tag_id,
			goat_picture: req.body.goat_picture,
			goat_firstname: req.body.goat_firstname,
			main_tag_name: req.body.main_tag_name,
			sub_tag_name: req.body.sub_tag_name,
			goat_name: req.body.goat_name,
			description: req.body.description,
		};
		const insertId = await advertRepository.create(newAdvert);
		res.status(201).json({ insertId });
	} catch (err) {
		next(err);
	}
};
const searchDescription: RequestHandler = async (req, res, next) => {
	try {
		const query = req.query.q as string;
		if (!query || query.trim() === "") {
			res.status(400).json({ message: "Query parameter 'q' is required." });
			return;
		}
		const results = await advertRepository.searchDescription(query);
		res.json(results);
	} catch (err) {
		next(err);
	}
};
const getMainTags: RequestHandler = async (req, res, next) => {
	try {
		const mainTags = await advertRepository.getMainTags();
		res.json(mainTags);
	} catch (err) {
		next(err);
	}
};
const searchMainTagsByName: RequestHandler = async (req, res, next) => {
	try {
		const query = req.query.q as string;
		if (!query || query.trim() === "") {
			res.status(400).json({ message: "Query parameter 'q' is required." });
			return;
		}
		const mainTags = await advertRepository.searchMainTagsByName(query);
		res.json(mainTags);
	} catch (err) {
		next(err);
	}
};
const searchSubTagsByName: RequestHandler = async (req, res, next) => {
	try {
		const query = req.query.q as string;
		if (!query || query.trim() === "") {
			res.status(400).json({ message: "Query parameter 'q' is required." });
			return;
		}
		const mainTags = await advertRepository.searchSubTagsByName(query);
		res.json(mainTags);
	} catch (err) {
		next(err);
	}
};

const filterAdverts: RequestHandler = async (req, res, next) => {
	try {
		const mainTagId = Number(req.query.mainTagId);
		const subTagId = Number(req.query.subTagId);
		if (Number.isNaN(mainTagId) || Number.isNaN(subTagId)) {
			res.status(400).json({ message: "Paramètres invalides" });
			return;
		}
		const adverts = await advertRepository.filterByTags(mainTagId, subTagId);
		res.json(adverts);
	} catch (err) {
		next(err);
	}
};
const getSubTagsByMainTag: RequestHandler = async (
	req,
	res,
	next,
): Promise<void> => {
	try {
		const mainTagId = Number(req.params.mainTagId);
		if (Number.isNaN(mainTagId)) {
			res.status(400).json({ message: "Paramètre invalide" });
			return;
		}

		const subTags = await advertRepository.takeSubTagsByMainTag(mainTagId);

		if (!subTags || subTags.length === 0) {
			res.status(404).json({ message: "Aucun sous-tag trouvé" });
			return;
		}
		res.json(subTags);
	} catch (err) {
		console.error("❌ Erreur lors de la récupération des sous-tags :", err);
		next(err);
	}
};

export default {
	browse,
	read,
	add,
	searchDescription,
	getMainTags,
	searchMainTagsByName,
	searchSubTagsByName,
	filterAdverts,
	getSubTagsByMainTag,
};
