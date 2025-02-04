import express from "express";
import advertActions from "./modules/advert/advertActions";
import advertServices from "./modules/advert/advertServices";
import goatActions from "./modules/goat/goatActions";
import mainTagActions from "./modules/tag/mainTagActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes

router.get("/api/main-tags", mainTagActions.browse);

router.get("/api/adverts", advertActions.browse);

router.post("/api/adverts", advertServices.validateAdvert, advertActions.add);

router.post("api/goats", goatActions.add);

/* ************************************************************************* */

export default router;
