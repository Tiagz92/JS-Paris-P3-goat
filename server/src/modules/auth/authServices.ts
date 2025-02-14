import argon2 from "argon2";
import type { NextFunction, Request, Response } from "express";

export const authServices = {
	hashPassword: async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (req.body.password) {
				const hashedPassword = await argon2.hash(req.body.password);
				req.body.password = hashedPassword;
			}
			next();
		} catch (err) {
			next(err);
		}
	},
};
