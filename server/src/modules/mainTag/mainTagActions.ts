import type { Request, Response } from "express";
import type { RequestHandler } from "express-serve-static-core";
import type { RowDataPacket } from "mysql2";
import type { MainTag } from "../../types/models";
import subTagRepository from "../subTag/subTagRepository";
import mainTagRepository from "./mainTagRepository";

interface SubTag extends RowDataPacket {
	id: number;
	name: string;
	main_tag_id: number;
}

type CustomRequestHandler<
	P = Record<string, unknown>,
	ResBody = unknown,
	ReqBody = unknown,
> = (
	req: Request<P, ResBody, ReqBody>,
	res: Response<ResBody>,
) => Promise<Response>;

type JsonResponse<T> = T | { message: string } | { error: string };

const browse: CustomRequestHandler<
	Record<string, unknown>,
	JsonResponse<MainTag[]>
> = async (req, res) => {
	try {
		const mainTags = await mainTagRepository.readAll();

		for (const mainTag of mainTags) {
			const subTags = await subTagRepository.readAllByMainTag(mainTag.id);
			mainTag.subTags = subTags as SubTag[];
		}

		return res.json(mainTags);
	} catch (err) {
		return res.status(500).json({ error: "Error fetching main tags" });
	}
};

export const mainTagHandlers = {
	browse,
	// ... autres handlers
};
