import express, {
	type Request,
	type Response,
	type Router,
	type RequestHandler,
} from "express";
import { ReservationActions } from "./ReservationActions";

const reservationRouter: Router = express.Router();

// Créer une réservation
reservationRouter.post("/reservations", (async (
	req: Request,
	res: Response,
) => {
	try {
		const { slot_id, user_id } = req.body;

		if (!slot_id || !user_id) {
			return res
				.status(400)
				.json({ error: "Slot ID and User ID are required" });
		}

		const reservation = await ReservationActions.createReservation(
			user_id,
			slot_id,
		);
		res.status(201).json(reservation);
	} catch (error: unknown) {
		console.error("Reservation creation error:", error);
		if (error instanceof Error) {
			if (error.message === "Slot not found or not available") {
				res.status(404).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Failed to create reservation" });
			}
		} else {
			res.status(500).json({ error: "An unknown error occurred" });
		}
	}
}) as RequestHandler);

// Récupérer les réservations d'un utilisateur
reservationRouter.get("/users/:userId/reservations", (async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = Number.parseInt(req.params.userId, 10);

		if (Number.isNaN(userId)) {
			return res.status(400).json({ error: "Invalid user ID" });
		}

		const reservations = await ReservationActions.getUserReservations(userId);
		res.json(reservations);
	} catch (error: unknown) {
		console.error("Get user reservations error:", error);
		res.status(500).json({ error: "Failed to retrieve reservations" });
	}
}) as RequestHandler);

// Récupérer les prochaines réservations d'un utilisateur
reservationRouter.get("/users/:userId/upcoming-reservations", (async (
	req: Request,
	res: Response,
) => {
	try {
		const userId = Number.parseInt(req.params.userId, 10);

		if (Number.isNaN(userId)) {
			return res.status(400).json({ error: "Invalid user ID" });
		}

		const upcomingReservations =
			await ReservationActions.getUpcomingReservations(userId);
		res.json(upcomingReservations);
	} catch (error: unknown) {
		console.error("Get upcoming reservations error:", error);
		res.status(500).json({ error: "Failed to retrieve upcoming reservations" });
	}
}) as RequestHandler);

// Annuler une réservation
reservationRouter.delete("/reservations/:reservationId", (async (
	req: Request,
	res: Response,
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
			res.status(200).json({ message: "Reservation cancelled successfully" });
		} else {
			res.status(404).json({ error: "Reservation not found" });
		}
	} catch (error: unknown) {
		console.error("Cancel reservation error:", error);

		if (error instanceof Error) {
			if (error.message === "Unauthorized") {
				res
					.status(403)
					.json({ error: "Unauthorized to cancel this reservation" });
			} else if (
				error.message ===
				"Cannot cancel reservation less than 24 hours before start time"
			) {
				res.status(400).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Failed to cancel reservation" });
			}
		} else {
			res.status(500).json({ error: "An unknown error occurred" });
		}
	}
}) as RequestHandler);

// Vérifier les conflits de réservation
reservationRouter.post("/reservations/conflict-check", (async (
	req: Request,
	res: Response,
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
		res.json({ hasConflict });
	} catch (error: unknown) {
		console.error("Conflict check error:", error);
		res.status(500).json({ error: "Failed to check reservation conflict" });
	}
}) as RequestHandler);

export default reservationRouter;
