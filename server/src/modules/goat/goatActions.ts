import type { RequestHandler } from "express";
import goatRepository from "./goatRepository";

const add: RequestHandler = async (req, res, next) => {
	try {
		const newGoat = {
			id: req.body.id,
			lastname: req.body.lastname,
			firstname: req.body.firstname,
			born_at: req.body.born_at,
			email: req.body.email,
			password: req.body.password,
			picture: req.body.picture,
			presentation: req.body.presentation,
			video: req.body.video,
		};
		const insertId = await goatRepository.createGoat(newGoat);
		res.status(201).json({ insertId });
	} catch (err) {
		next(err);
	}
};

export default { add };
