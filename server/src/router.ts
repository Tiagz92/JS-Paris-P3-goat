import express from "express";
import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import multer from "multer";
import { advertHandlers } from "./modules/advert/advertActions";
import { advertServices } from "./modules/advert/advertServices";
import { authServices } from "./modules/auth/authServices";
import { goatHandlers } from "./modules/goat/goatActions";
import { mainTagHandlers } from "./modules/mainTag/mainTagActions";
import type { Advert, MainTag, SubTag } from "./types/models";
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const fileUpload = multer({ storage });

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Main tags routes
router.get(
	"/main-tags",
	mainTagHandlers.browse as unknown as RequestHandler<
		ParamsDictionary,
		MainTag[]
	>,
);
router.get(
	"/main-tags/:mainTagId/sub-tags",
	advertHandlers.getSubTagsByMainTag as RequestHandler<
		{ mainTagId: string },
		SubTag[]
	>,
);

router.get(
	"/adverts",
	advertHandlers.browse as RequestHandler<ParamsDictionary, Advert[]>,
);
router.get(
	"/adverts/:id",
	advertHandlers.read as RequestHandler<{ id: string }, Advert | null>,
);
router.post(
	"/adverts",
	advertServices.validateAdvert,
	advertHandlers.add as RequestHandler<ParamsDictionary, { insertId: number }>,
);

// Search routes
router.get(
	"/search/subtag/:mainTagId",
	advertHandlers.getSubTagsByMainTag as RequestHandler<
		{ mainTagId: string },
		SubTag[]
	>,
);
router.get(
	"/search/maintags",
	advertHandlers.getMainTags as RequestHandler<ParamsDictionary, MainTag[]>,
);

// Goat routes
router.post(
	"/goats",
	fileUpload.any(),
	authServices.hashPassword,
	goatHandlers.add as RequestHandler<ParamsDictionary, { insertId: number }>,
);

export default router;
