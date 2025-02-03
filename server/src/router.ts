import express from "express";
import advertActions from "./modules/advert/advertActions";
import reservationRouter from "./modules/reservation/reservationRoutes";

const router = express.Router();

// Routes pour les annonces
router.get("/api/adverts", advertActions.browse);

// Montage du router des réservations
router.use("/api", reservationRouter);

export default router;
