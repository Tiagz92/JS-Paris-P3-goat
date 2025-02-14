import express from "express";
import type { Request, Response } from "express";
import type { RequestHandler } from "express-serve-static-core";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import database from "../../../database/client";
import type { Slot } from "../../types/models";

interface SlotRow extends Slot, RowDataPacket {}

type JsonResponse<T> = T | { message: string } | { error: string };

type Params = {
	id?: string;
	advertId?: string;
};

const slotRouter = express.Router();

type CustomRequestHandler<
	P = Record<string, unknown>,
	ResBody = unknown,
	ReqBody = unknown,
> = (
	req: Request<P, ResBody, ReqBody>,
	res: Response<ResBody>,
) => Promise<void>;

const getSlotsByAdvert: CustomRequestHandler<
	Params,
	JsonResponse<SlotRow[]>
> = async (req, res): Promise<void> => {
	try {
		const advertId = Number(req.params.id);
		const weekOffset = Number(req.query.week as string) || 0;

		const [slots] = await database.query<SlotRow[]>(
			"SELECT s.*, g.first_name as goat_firstname FROM slot s JOIN goat g ON s.goat_id = g.id WHERE s.advert_id = ? AND s.status = 'available' AND s.start_at >= NOW() + INTERVAL ? WEEK AND s.start_at < NOW() + INTERVAL ? WEEK + INTERVAL 1 WEEK ORDER BY s.start_at ASC",
			[advertId, weekOffset, weekOffset],
		);

		res.json(slots);
	} catch (error) {
		console.error("Error fetching slots:", error);
		res.status(500).json({ message: "Error fetching slots" });
	}
};

slotRouter.get("/advert/:id", getSlotsByAdvert as RequestHandler);

const checkSlotAvailability: CustomRequestHandler<
	Params,
	JsonResponse<{ available: boolean; slot: SlotRow | null }>,
	unknown
> = async (req, res): Promise<void> => {
	try {
		const slotId = Number(req.params.id);
		const [slots] = await database.query<SlotRow[]>(
			"SELECT * FROM slot WHERE id = ? AND status = 'available'",
			[slotId],
		);

		if (!Array.isArray(slots) || slots.length === 0) {
			res.json({ available: false, slot: null });
			return;
		}

		res.json({
			available: true,
			slot: slots[0],
		});
	} catch (error) {
		console.error("Error checking slot availability:", error);
		res.status(500).json({ message: "Une erreur est survenue" });
	}
};

slotRouter.get(
	"/:id/check-availability",
	checkSlotAvailability as RequestHandler,
);

export default slotRouter;
