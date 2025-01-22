import type { NextFunction, Request, Response } from "express";
import searchBarRepository from "./searchBarRepository";
const search = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const query = req.query.query as string;

		if (!query) {
			return res.status(400).json({ message: "Query parameter is required" });
		}

		const results = await searchBarRepository.search(query);

		if (results) {
			return res.status(200).json(results);
		}

		return res.status(404).json({ message: "No results found" });
	} catch (err) {
		next(err);
	}
};

export default search;
