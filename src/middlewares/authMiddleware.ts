import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

interface DecodedToken {
	_id: string;
}

export const authMiddleware = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token: string =
				req.cookies?.accessToken ||
				req.header("Authorization")?.replace("Bearer ", "");

			if (!token) {
				new ApiError(401, "Unauthorized request");
			}

			const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;

			const user = await User.findById(decodedToken._id).select(
				"-password"
			);

			if (!user) {
				throw new ApiError(401, "Invalid access token");
			}

			req.user = user;

			next();
		} catch (error) {
			console.error("Error authenticating user", error);
			return res
				.status(401)
				.json(new ApiResponse(401, null, "Unauthorized request"));
		}
	}
);
