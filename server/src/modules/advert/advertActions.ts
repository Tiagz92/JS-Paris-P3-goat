import type { RequestHandler } from "express";
import advertRepository from "./advertRepository";
const browse: RequestHandler = async (req, res, next) => {
	try {
		const adverts = await advertRepository.readAll();
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
			res.json(advert);
		}
	} catch (err) {
		next(err);
	}
};
const add: RequestHandler = async (req, res, next) => {
	try {
		const newAdvert = {
			id: req.body.id,
			description: req.body.description,
			goat_id: req.body.goat_id,
			main_tag_id: req.body.main_tag_id,
			sub_tag_id: req.body.sub_tag_id,
		};
		const insertId = await advertRepository.create(newAdvert);
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
export default { browse, read, add, search, getMainTags };
