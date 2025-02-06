import type { RequestHandler } from "express";
import type { NextFunction, Request, Response } from "express";
import goatRepository from "../goat/goatRepository";
import mainTagRepository from "../mainTag/mainTagRepository";
import subTagRepository from "../subTag/subTagRepository";
import advertRepository from "./advertRepository";

export const browse: RequestHandler = async (req, res, next): Promise<void> => {
	try {
		const adverts = await advertRepository.readAll();

		for (const advert of adverts) {
			const goat = await goatRepository.read(advert.goat_id);
			if (!goat) {
				res.sendStatus(404);
				return;
			}
			advert.goat_firstname = goat.firstname;
			advert.goat_picture = goat.picture;

			const mainTag = await mainTagRepository.read(advert.main_tag_id);
			if (!mainTag) {
				res.sendStatus(404);
				return;
			}
			advert.main_tag_name = mainTag.name;

			const subTag = await subTagRepository.read(advert.sub_tag_id);
			if (!subTag) {
				res.sendStatus(404);
				return;
			}
			advert.sub_tag_name = subTag.name;
		}

		res.json(adverts);
		return;
	} catch (err) {
		next(err);
	}
};

export const read: RequestHandler = async (req, res, next): Promise<void> => {
	try {
		const advertId = Number(req.params.id);
		const advert = await advertRepository.read(advertId);
		if (advert == null) {
			res.sendStatus(404);
			return;
		}
		const goat = await goatRepository.read(advert.goat_id);
		if (!goat) {
			res.sendStatus(404);
			return;
		}
		advert.goat_firstname = goat.firstname;
		advert.goat_picture = goat.picture;

		const mainTag = await mainTagRepository.read(advert.main_tag_id);
		if (!mainTag) {
			res.sendStatus(404);
			return;
		}
		advert.main_tag_name = mainTag.name;

		const subTag = await subTagRepository.read(advert.sub_tag_id);
		if (!subTag) {
			res.sendStatus(404);
			return;
		}
		advert.sub_tag_name = subTag.name;

		res.json(advert);
		return;
	} catch (err) {
		next(err);
	}
};

export const add: RequestHandler = async (req, res, next): Promise<void> => {
	try {
		const newAdvert = {
			id: req.body.id,
			description: req.body.description,
			goat_id: req.body.goat_id,
			main_tag_id: req.body.main_tag_id,
			sub_tag_id: req.body.sub_tag_id,
			goat_firstname: req.body.goat_firstname,
			goat_picture: req.body.goat_picture,
			main_tag_name: req.body.main_tag_name,
			sub_tag_name: req.body.sub_tag_name,
		};
		const insertId = await advertRepository.createAdvert(newAdvert);
		res.status(201).json({ insertId });
		return;
	} catch (err) {
		next(err);
	}
};

export const searchDescription: RequestHandler = async (
	req,
	res,
	next,
): Promise<void> => {
	try {
		const query = req.query.q as string;
		if (!query || query.trim() === "") {
			res.status(400).json({ message: "Query parameter 'q' is required." });
			return;
		}
		const results = await advertRepository.searchDescription(query);
		res.json(results);
		return;
	} catch (err) {
		next(err);
	}
};

export const getMainTags: RequestHandler = async (
	req,
	res,
	next,
): Promise<void> => {
	try {
		const mainTags = await advertRepository.getMainTags();
		res.json(mainTags);
		return;
	} catch (err) {
		next(err);
	}
};

export const searchMainTagsByName: RequestHandler = async (
	req,
	res,
	next,
): Promise<void> => {
	try {
		const query = req.query.q as string;
		if (!query || query.trim() === "") {
			res.status(400).json({ message: "Query parameter 'q' is required." });
			return;
		}
		const mainTags = await advertRepository.searchMainTagsByName(query);
		res.json(mainTags);
		return;
	} catch (err) {
		next(err);
	}
};

export const searchSubTagsByName: RequestHandler = async (
	req,
	res,
	next,
): Promise<void> => {
	try {
		const query = req.query.q as string;
		if (!query || query.trim() === "") {
			res.status(400).json({ message: "Query parameter 'q' is required." });
			return;
		}
		const subTags = await advertRepository.searchSubTagsByName(query);
		res.json(subTags);
		return;
	} catch (err) {
		next(err);
	}
};

export const filterAdverts: RequestHandler = async (
	req,
	res,
	next,
): Promise<void> => {
	try {
		const mainTagId = Number(req.query.mainTagId);
		const subTagId = Number(req.query.subTagId);
		if (Number.isNaN(mainTagId) || Number.isNaN(subTagId)) {
			res.status(400).json({ message: "Paramètres invalides" });
			return;
		}
		const adverts = await advertRepository.filterByTags(mainTagId, subTagId);
		res.json(adverts);
		return;
	} catch (err) {
		next(err);
	}
};

export const getSubTagsByMainTag: RequestHandler = async (
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
		return;
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
