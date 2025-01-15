import express from "express";
import advertActions from "./modules/advert/advertActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes

// router.get("/api/items", itemActions.browse);
// router.get("/api/items/:id", itemActions.read);
// router.post("/api/items", itemActions.add);
router.post("/api/advert", advertActions.add);

/* ************************************************************************* */

export default router;
