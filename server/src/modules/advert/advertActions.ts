import type { RequestHandler } from "express";
import type { Request, Response } from "express";
import advertRepository from "./advertRepository";

const add: RequestHandler = async (req: Request, res: Response, next) => {
	try {
		const newAdvert = {
			id: req.body.id,
			description: req.body.description,
			goat_id: req.body.goat_id,
			main_tag_id: req.body.main_tag_id,
			sub_tag_id: req.body.sub_tag_id,
		};
		const insertId = await advertRepository.createAdvert(newAdvert);
		res.status(201).json({ insertId });
	} catch (err) {
		next(err);
	}
};

export default { add };
