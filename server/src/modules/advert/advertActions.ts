import type { RequestHandler } from "express";
import type { NextFunction, Request, Response } from "express";
import goatRepository from "../goat/goatRepository";
import mainTagRepository from "../mainTag/mainTagRepository";
import subTagRepository from "../subTag/subTagRepository";
import advertRepository from "./advertRepository";

interface Advert {
	id: number;
	goat_id: number;
	goat_firstname: string;
	goat_picture: string;
}

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
			// advert.goat_firstname = goat.firstname;
			// advert.goat_picture = goat.picture;
		}

		for (const advert of adverts) {
			const mainTags = await mainTagRepository.read(advert.main_tag_id);
			if (!mainTags) {
				res.sendStatus(404);
			}
			// advert.main_tag_name = main_tag.name;
		}

		res.json(adverts);
	} catch (err) {
		next(err);
	}
};

export default { browse };
