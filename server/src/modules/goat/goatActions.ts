import type { RequestHandler } from "express";
import type { Goat } from "../../types/models";
import goatRepository from "./goatRepository";

const add: RequestHandler = async (req, res, next) => {
	try {
		const files = req.files as Express.Multer.File[] | undefined;
		if (!files || files.length === 0 || !files[0]) {
			res.status(400).json({ error: "Picture is required" });
			return;
		}

		const newGoat: Goat = {
			id: req.body.id,
			lastname: req.body.lastname,
			firstname: req.body.firstname,
			name: `${req.body.firstname} ${req.body.lastname}`,
			born_at: req.body.born_at,
			email: req.body.email,
			password: req.body.password,
			picture: files[0].filename,
			presentation: req.body.presentation,
			video: files[1] ? files[1].filename : null,
		};
		const { id, name, ...goatData } = newGoat;
		const insertId = await goatRepository.createGoat(goatData);
		res.status(201).json({ insertId });
		return;
	} catch (err) {
		next(err);
	}
};

export default { add };
