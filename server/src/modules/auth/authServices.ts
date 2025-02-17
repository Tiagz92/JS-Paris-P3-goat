import argon from "argon2";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import type { Secret } from "jsonwebtoken";

const hashPassword = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { password } = req.body;
	try {
		const hash = await argon.hash(password);
		req.body.password = hash;
		next();
	} catch (error) {
		next(error);
	}
};

const isAuth = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.sendStatus(401);
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		return res.sendStatus(401);
	}

	try {
		const isTokenValid = jwt.verify(token, process.env.APP_SECRET as Secret);
		if (!isTokenValid) {
			return res.sendStatus(401);
		}
		next();
	} catch (error) {
		console.error("Erreur JWT:", error);
		return res.sendStatus(403);
	}
};

export default { hashPassword, isAuth };
