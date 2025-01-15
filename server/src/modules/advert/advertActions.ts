import type { RequestHandler } from "express";
import type { NextFunction, Request, Response } from "express";
import advertRepository from "./advertRepository";

const browse: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const adverts = await advertRepository.readAll();
		res.json(adverts);
	} catch (err) {
		next(err);
	}
};

export default { browse };
