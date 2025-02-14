import type { Request, Response } from "express";
import type { RequestHandler } from "express-serve-static-core";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { Advert } from "../../types/models";
import mainTagRepository from "../mainTag/mainTagRepository";
import subTagRepository from "../subTag/subTagRepository";
import advertRepository from "./advertRepository";
import type { AdvertWithDetails, NewAdvert } from "./advertRepository";

interface AdvertRow extends Advert, RowDataPacket {}

export const AdvertActions = {
	async createAdvert(newAdvertData: NewAdvert) {
		const insertId = await advertRepository.create(newAdvertData);
		return insertId;
	},

	async browse() {
		return advertRepository.readAll();
	},

	async read(id: number) {
		return advertRepository.read(id);
	},

	async getSubTagsByMainTag(mainTagId: number) {
		return subTagRepository.readAllByMainTag(mainTagId);
	},

	async getMainTags() {
		return mainTagRepository.readAll();
	},
};

export const advertHandlers = {
	browse: async (req: Request, res: Response): Promise<void> => {
		try {
			const adverts = await advertRepository.readAll();
			res.json(adverts);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Error getting adverts" });
		}
	},

	read: async (req: Request, res: Response): Promise<void> => {
		try {
			const advert = await AdvertActions.read(Number(req.params.id));
			if (advert == null) {
				res.sendStatus(404);
				return;
			}
			res.json(advert);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Error reading advert" });
		}
	},

	add: async (req: Request, res: Response): Promise<void> => {
		try {
			const newAdvert: NewAdvert = {
				description: req.body.description,
				goat_id: req.body.goat_id,
				main_tag_id: req.body.main_tag_id,
				sub_tag_id: req.body.sub_tag_id,
			};
			const insertId = await AdvertActions.createAdvert(newAdvert);
			res.status(201).json({ insertId });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Error creating advert" });
		}
	},

	getSubTagsByMainTag: async (req: Request, res: Response): Promise<void> => {
		try {
			const mainTagId = Number(req.params.mainTagId);
			const subTags = await AdvertActions.getSubTagsByMainTag(mainTagId);
			res.json(subTags);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Error getting sub tags" });
		}
	},

	getMainTags: async (req: Request, res: Response): Promise<void> => {
		try {
			const mainTags = await AdvertActions.getMainTags();
			res.json(mainTags);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Error getting main tags" });
		}
	},
} as const;
