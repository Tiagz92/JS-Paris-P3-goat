import argon from "argon2";
import type { RequestHandler } from "express";
import goatRepository from "../goat/goatRepository";

const login: RequestHandler = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const [[user]] = await goatRepository.readUserByEmail(email);
		if (!user) res.status(404);
		else {
			const passwordMatch = await argon.verify(user.password, password);
			if (!passwordMatch) res.status(422);
			else res.status(200).json(user);
		}
	} catch (error) {
		next(error);
	}
};

export default { login };
