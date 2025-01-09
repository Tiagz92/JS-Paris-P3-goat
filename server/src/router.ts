import express from "express";
//import goatActions from "./modules/goat/goatActions";
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

// Goat routes
// router.get("/api/goat", goatActions.getGoats);
// router.get("/api/goat/:id", goatActions.getOneGoat);
// router.get("/api/goat/:id/advert", goatActions.getGoatAdverts);
// router.get("/api/goat/:id/slot", goatActions.getGoatSlots);
// router.post("/api/goat", goatActions.addGoat);
// router.post("/api/goat/:id/advert", goatActions.addGoatAdvert);
// router.post("/api/goat/:id/slot", goatActions.addGoatSlot);
// router.put("/api/goat/:id", goatActions.updateGoat);
// router.put("/api/goat/:id/advert", goatActions.updateGoatAdvert);
// router.put("/api/goat/:id/slot", goatActions.updateGoatSlot);
// router.delete("/api/goat/:id", goatActions.deleteGoat);
// router.delete("/api/goat/:id/advert", goatActions.deleteGoatAdvert);
// router.delete("/api/goat/:id/slot", goatActions.deleteGoatSlot);

// // Tag routes
// router.get("/api/main_tag", tagsActions.getTags);
// router.get("/api/main_tag/:id", tagsActions.getOneTag);
// router.get("/api/sub_tag", tagsActions.getSubTags);
// router.get("/api/sub_tag/:id", tagsActions.getOneSubTag);

/* ************************************************************************* */

export default router;
