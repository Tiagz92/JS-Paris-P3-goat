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

router.get("/api/advert/:id", advertActions.read);
router.get("/search/description", advertActions.searchDescription);
router.get("/search/maintags", advertActions.searchMainTagsByName);
router.get("/search/subtags", advertActions.searchSubTagsByName);
router.get("/filter/advert", advertActions.filterAdverts);
router.get(
	"/advert/search/subtag/:mainTagId",
	advertActions.getSubTagsByMainTag,
);

router.get("/advert/maintags", advertActions.getMainTags);

export default router;
