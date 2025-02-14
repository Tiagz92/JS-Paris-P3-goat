import type { Request, Response } from "express";
import type { RequestHandler } from "express-serve-static-core";
import type { Goat } from "../../types/models";
import goatRepository from "./goatRepository";
import type { NewGoat } from "./goatRepository";

export const goatHandlers = {
	add: async (req: Request, res: Response): Promise<void> => {
		try {
			const files = req.files as Express.Multer.File[] | undefined;
			if (!files || files.length === 0 || !files[0]) {
				res.status(400).json({ error: "Picture is required" });
				return;
			}

			const goatData: NewGoat = {
				first_name: String(req.body.first_name),
				name: String(req.body.name),
				email: String(req.body.email),
				password: String(req.body.password),
				picture: files[0].filename,
				presentation: String(req.body.presentation),
				video: files[1] ? files[1].filename : null,
			};

			const insertId = await goatRepository.createGoat(goatData);
			res.status(201).json({ insertId });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Error creating goat" });
		}
	},
	// ... autres handlers
} as const;
