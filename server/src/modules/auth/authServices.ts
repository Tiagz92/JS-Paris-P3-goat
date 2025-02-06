import argon from "argon2";
import type { RequestHandler } from "express";

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

export default { hashPassword };
