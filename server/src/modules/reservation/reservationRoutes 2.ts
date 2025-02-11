import express, {
	type Request,
	type Response,
	type Router,
	type RequestHandler,
	type NextFunction,
} from "express";
import { ReservationActions } from "./ReservationActions.js";

const reservationRouter: Router = express.Router();

/**
 * Crée une réservation
 * POST /reservations
 * Body attendu : { slot_id, user_id }
 */
reservationRouter.post("/reservations", (async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { slot_id, user_id } = req.body;

		if (!slot_id || !user_id) {
			return res
				.status(400)
				.json({ error: "Slot ID and User ID are required" });
		}

		// Appel de l'action métier pour créer la réservation.
		const reservation = await ReservationActions.createReservation(
			user_id,
			slot_id,
		);
		return res.status(201).json(reservation);
	} catch (error) {
		next(error);
	}
}) as RequestHandler);

/**
 * Récupère toutes les réservations d'un utilisateur
 * GET /users/:userId/reservations
 */
reservationRouter.get("/users/:userId/reservations", (async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = Number.parseInt(req.params.userId, 10);
		if (Number.isNaN(userId)) {
			return res.status(400).json({ error: "Invalid user ID" });
		}
		const reservations = await ReservationActions.getUserReservations(userId);
		return res.json(reservations);
	} catch (error) {
		next(error);
	}
}) as RequestHandler);

/**
 * Récupère les prochaines réservations d'un utilisateur
 * GET /users/:userId/upcoming-reservations
 */
reservationRouter.get("/users/:userId/upcoming-reservations", (async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = Number.parseInt(req.params.userId, 10);
		if (Number.isNaN(userId)) {
			return res.status(400).json({ error: "Invalid user ID" });
		}
		const upcomingReservations =
			await ReservationActions.getUpcomingReservations(userId);
		return res.json(upcomingReservations);
	} catch (error) {
		next(error);
	}
}) as RequestHandler);

/**
 * Annule une réservation
 * DELETE /reservations/:reservationId
 * Body attendu : { user_id }
 */
reservationRouter.delete("/reservations/:reservationId", (async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const reservationId = Number.parseInt(req.params.reservationId, 10);
		const userId = req.body.user_id;
		if (Number.isNaN(reservationId) || !userId) {
			return res
				.status(400)
				.json({ error: "Reservation ID and User ID are required" });
		}
		const result = await ReservationActions.cancelReservation(
			userId,
			reservationId,
		);
		if (result) {
			return res
				.status(200)
				.json({ message: "Reservation cancelled successfully" });
		}
		return res.status(404).json({ error: "Reservation not found" });
	} catch (error) {
		next(error);
	}
}) as RequestHandler);

/**
 * Vérifie les conflits de réservation pour un utilisateur sur un créneau donné
 * POST /reservations/conflict-check
 * Body attendu : { user_id, slot_id }
 */
reservationRouter.post("/reservations/conflict-check", (async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { user_id, slot_id } = req.body;
		if (!user_id || !slot_id) {
			return res
				.status(400)
				.json({ error: "User ID and Slot ID are required" });
		}
		const hasConflict = await ReservationActions.checkReservationConflict(
			user_id,
			slot_id,
		);
		return res.json({ hasConflict });
	} catch (error) {
		next(error);
	}
}) as RequestHandler);

export default reservationRouter;
