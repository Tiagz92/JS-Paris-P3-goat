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
	} catch (err) {
		next(err);
	}
};
const search: RequestHandler = async (req, res, next) => {
	try {
		const query = req.query.q as string;
		if (!query || query.trim() === "") {
			res.status(400).json({ message: "Query parameter 'q' is required." });
			return;
		}
		const results = await advertRepository.search(query);
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
const readByMainTagId: RequestHandler = async (req, res, next) => {
	try {
		const mainTagId = Number(req.params.id);
		if (Number.isNaN(mainTagId)) {
			res.status(400).json({ message: "Invalid mainTagId parameter." });
			return;
		}
		const adverts = await advertRepository.readByMainTagId(mainTagId);
		res.json(adverts);
	} catch (err) {
		next(err);
	}
};

export default { browse, read, add, search, getMainTags, readByMainTagId };
