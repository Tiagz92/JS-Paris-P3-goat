import express from "express";
import advertActions from "./modules/advert/advertActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes

router.get("/api/adverts", advertActions.browse);

/* ************************************************************************* */

export default router;
