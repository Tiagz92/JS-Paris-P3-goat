import express from "express";
import type { Request, Response } from "express";
import database from "../../../database/client";
import advertRepository from "./advertRepository";

const advertRouter = express.Router();

advertRouter.get("/:id", async (req: Request, res: Response) => {
	try {
		const advertId = Number.parseInt(req.params.id, 10);
		const advert = await advertRepository.read(advertId);

		if (!advert) {
			res.status(404).json({ message: "Advert not found" });
			return;
		}

		res.json(advert);
	} catch (error) {
		console.error("Error fetching advert:", error);
		res.status(500).json({ message: "Error fetching advert" });
	}
});

export default advertRouter;
