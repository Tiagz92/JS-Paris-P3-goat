import argon from "argon2";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const hashPassword: RequestHandler = async (req, res, next) => {
	const { password } = req.body;
	try {
		const hash = await argon.hash(password);
		req.body.password = hash;
		next();
	} catch (error) {
		next(error);
	}
};

const isAuth: RequestHandler = (req, res, next) => {
	const token = req.headers.authorization;
	if (!token) res.sendStatus(401);
	else {
		const isTokenValid = jwt.verify(token, process.env.APP_SECRET);
		if (!isTokenValid) res.sendStatus(401);
		else next();
	}
};

export default { hashPassword, isAuth };
