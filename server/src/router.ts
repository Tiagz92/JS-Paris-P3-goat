import express from "express";
import advertActions from "./modules/advert/advertActions";
import advertServices from "./modules/advert/advertServices";
import authServices from "./modules/auth/authServices";
import goatActions from "./modules/goat/goatActions";
import mainTagActions from "./modules/mainTag/mainTagActions";
import fileUpload from "./services/fileUpload";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes

router.get("/api/main-tags", mainTagActions.browse);

router.get("/api/adverts", advertActions.browse);
router.get("/api/adverts/:id", advertActions.read);
router.post("/api/adverts", advertActions.add);
router.post("/api/advert", advertServices.validateAdvert, advertActions.add);

router.get(
	"/advert/search/subtag/:mainTagId",
	advertActions.getSubTagsByMainTag,
);

router.get("/search/description", advertActions.searchDescription);
router.get("/search/maintags", advertActions.searchMainTagsByName);
router.get("/search/subtags", advertActions.searchSubTagsByName);

router.get("/filter/advert", advertActions.filterAdverts);

router.get("/advert/maintags", advertActions.getMainTags);

router.post("/api/adverts", advertServices.validateAdvert, advertActions.add);

router.post(
	"/api/goats",
	fileUpload.any(),
	authServices.hashPassword,
	goatActions.add,
);

export default router;
