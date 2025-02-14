import express from "express";
import type { Request, Response } from "express";
import type { RequestHandler } from "express-serve-static-core";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { Reservation } from "../../types/models";
import logger from "../../utils/logger";
import { ReservationActions } from "./ReservationActions";

// Définir un type pour les réponses JSON
type JsonResponse<T> = T | { message: string } | { error: string };

const reservationRouter = express.Router();

type Params = {
	id?: string;
	userId?: string;
};

type CustomRequestHandler<
	P = Record<string, unknown>,
	ResBody = unknown,
	ReqBody = unknown,
> = (
	req: Request<P, ResBody, ReqBody>,
	res: Response<ResBody>,
) => Promise<void>;

interface ReservationRow extends Reservation, RowDataPacket {}

const createReservation: CustomRequestHandler<
	Params,
	JsonResponse<ReservationRow>,
	{ userId: number; slotId: number }
> = async (req, res): Promise<void> => {
	try {
		logger.debug("=== Début de la requête de réservation ===");
		const { userId, slotId } = req.body;

		if (!userId || !slotId) {
			res.status(400).json({
				message: !userId ? "userId est requis" : "slotId est requis",
			});
			return;
		}

		const reservation = await ReservationActions.createReservation(
			Number(userId),
			Number(slotId),
		);

		logger.debug("Réservation créée:", reservation);
		res.status(201).json(reservation as ReservationRow);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Une erreur est survenue" });
	}
};

const getUserReservations: CustomRequestHandler<
	{ userId: string },
	JsonResponse<ReservationRow[]>
> = async (req, res): Promise<void> => {
	try {
		const userId = Number(req.params.userId);
		const reservations = await ReservationActions.getUserReservations(userId);
		res.json(reservations as ReservationRow[]);
	} catch (error) {
		logger.error("Error getting user reservations:", error);
		res.status(500).json({ message: "Une erreur est survenue" });
	}
};

const getUpcomingReservations: CustomRequestHandler<
	{ userId: string },
	JsonResponse<ReservationRow[]>
> = async (req, res): Promise<void> => {
	try {
		const userId = Number(req.params.userId);
		const upcomingReservations =
			await ReservationActions.getUpcomingReservations(userId);
		res.json(upcomingReservations as ReservationRow[]);
	} catch (error) {
		logger.error("Error getting upcoming reservations:", error);
		res.status(500).json({ message: "Une erreur est survenue" });
	}
};

const cancelReservation: CustomRequestHandler<
	{ id: string },
	JsonResponse<{ message: string }>,
	{ userId: number }
> = async (req, res): Promise<void> => {
	try {
		const reservationId = Number(req.params.id);
		const userId = Number(req.body.userId);

		if (!reservationId || !userId) {
			res.status(400).json({
				message: "reservationId et userId sont requis",
			});
			return;
		}

		const result = await ReservationActions.cancelReservation(
			userId,
			reservationId,
		);

		if (result) {
			res.json({ message: "Réservation annulée avec succès" });
			return;
		}

		res.status(404).json({ message: "Réservation non trouvée" });
	} catch (error) {
		logger.error("Error cancelling reservation:", error);
		if (error instanceof Error) {
			res.status(400).json({ message: error.message });
			return;
		}
		res.status(500).json({ message: "Une erreur est survenue" });
	}
};

const checkConflict: CustomRequestHandler<
	Params,
	JsonResponse<{ hasConflict: boolean }>,
	{ userId: number; slotId: number }
> = async (req, res): Promise<void> => {
	try {
		const { userId, slotId } = req.body;
		if (!userId || !slotId) {
			res.status(400).json({
				message: "userId et slotId sont requis",
			});
			return;
		}
		const hasConflict = await ReservationActions.checkReservationConflict(
			userId,
			slotId,
		);
		res.json({ hasConflict });
	} catch (error) {
		logger.error("Error checking conflict:", error);
		res.status(500).json({ message: "Une erreur est survenue" });
	}
};

const reserveSlot: CustomRequestHandler<
	{ id: string },
	JsonResponse<ReservationRow>,
	{ userId?: number }
> = async (req, res): Promise<void> => {
	try {
		const slotId = Number.parseInt(req.params.id, 10);
		const userId = 1;

		const reservation = await ReservationActions.createReservation(
			userId,
			slotId,
		);

		res.status(201).json({
			...reservation,
			google_meet_link: "https://meet.google.com/test-link",
		} as ReservationRow);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ message: "Erreur lors de la réservation" });
	}
};

// Regrouper toutes les routes à la fin du fichier
reservationRouter.post("/", createReservation as RequestHandler);
reservationRouter.get(
	"/user/:userId",
	getUserReservations as RequestHandler<{ userId: string }>,
);
reservationRouter.get(
	"/upcoming/:userId",
	getUpcomingReservations as RequestHandler<{ userId: string }>,
);
reservationRouter.delete(
	"/:id",
	cancelReservation as RequestHandler<{ id: string }>,
);
reservationRouter.post("/conflict-check", checkConflict as RequestHandler);
reservationRouter.post(
	"/slots/:id/reserve",
	reserveSlot as RequestHandler<{ id: string }>,
);

export default reservationRouter;
