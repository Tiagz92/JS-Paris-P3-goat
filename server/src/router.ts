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

router.get("/api/adverts/:id", advertActions.read);
router.get("/api/search/description", advertActions.searchDescription);
router.get("/api/search/maintags", advertActions.searchMainTagsByName);
router.get("/api/search/subtags", advertActions.searchSubTagsByName);
router.get("/api/filter/advert", advertActions.filterAdverts);
router.get(
	"/api/adverts/search/subtag/:mainTagId",
	advertActions.getSubTagsByMainTag,
);

router.get("/api/adverts/maintags", advertActions.getMainTags);

export default router;
