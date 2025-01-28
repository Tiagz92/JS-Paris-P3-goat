import express from "express";
import advertActions from "./modules/advert/advertActions";
import advertServices from "./modules/advert/advertServices";
import mainTagActions from "./modules/tag/mainTagActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes

router.get("/api/main-tag", mainTagActions.browse);

router.get("/api/adverts", advertActions.browse);

router.post("/api/advert", advertServices.validateAdvert, advertActions.add);

router.get("/api/advert", advertActions.browse);
router.get("/api/advert/:id", advertActions.read);
router.post("/api/advert", advertActions.add);
router.get("/search", advertActions.search);
router.get("/advert/maintags", advertActions.getMainTags);
router.get("/advert/maintags/:id", advertActions.readByMainTagId);

/* ************************************************************************* */

export default router;
