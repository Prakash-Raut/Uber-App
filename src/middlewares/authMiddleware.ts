import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { User } from "../models/User";

interface DecodedToken {
	_id: string;
}

export async function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const token: string =
			req.cookies?.token ||
			req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			res.status(401).json({ message: "Access Denied" });
		}

		const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

		const user = await User.findById(decoded._id);

		if (!user) {
			res.status(400).json({ message: "Invalid token" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "Unauthorized" });
	}
}
