import express from "express";
import advertActions from "./modules/advert/advertActions";
import { ReservationActions } from "./modules/reservation/ReservationActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes

router.get("/api/adverts", advertActions.browse);

/* ************************************************************************* */

export default router;
