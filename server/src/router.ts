import express from "express";
import advertActions from "./modules/advert/advertActions";
import itemActions from "./modules/item/itemActions";

//import tagsActions from "./modules/tags/tagsActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

router.get("/api/advert", advertActions.browse);
router.get("/api/advert/:id", advertActions.read);
router.post("/api/advert", advertActions.add);
router.get("/search", advertActions.search);
router.get("/advert/maintags", advertActions.getMainTags);

/* ************************************************************************* */

export default router;
