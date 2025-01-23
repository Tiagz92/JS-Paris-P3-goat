import express from "express";
import advertActions from "./modules/advert/advertActions";
import advertServices from "./modules/advert/advertServices";
import mainTagActions from "./modules/tag/mainTagActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes

// router.get("/api/items", itemActions.browse);
// router.get("/api/items/:id", itemActions.read);
// router.post("/api/items", itemActions.add);
router.get("/api/main-tag", mainTagActions.browse);

router.get("/api/adverts", advertActions.browse);

router.post("/api/advert", advertServices.validateAdvert, advertActions.add);

/* ************************************************************************* */

export default router;
