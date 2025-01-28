import express from "express";
import advertActions from "./modules/advert/advertActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes

router.get("/api/adverts", advertActions.browse);

router.get("/api/adverts", advertActions.browse);
router.get("/api/adverts/:id", advertActions.read);
router.post("/api/adverts", advertActions.add);

/* ************************************************************************* */

export default router;
