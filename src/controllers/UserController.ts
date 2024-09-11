import type { Request, Response } from "express";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { signinSchema } from "../validations/signinValidation";
import { signupSchema } from "../validations/signupValidation";

const register = asyncHandler(async (req: Request, res: Response) => {
	try {
		const result = signupSchema.safeParse(req.body);

		if (!result.success) {
			throw new ApiError(400, "All fields are required");
		}

		const existedUser = await User.findOne({ email: result.data.email });

		if (existedUser) {
			throw new ApiError(409, "User with email already exists");
		}

		const user = await User.create({
			...result.data,
		});

		const createdUser = await User.findById(user._id).select("-password");

		if (!createdUser) {
			throw new ApiError(
				500,
				"Something went wrong while registering user"
			);
		}

		return res
			.status(201)
			.json(
				new ApiResponse(
					200,
					createdUser,
					"User registered successfully"
				)
			);
	} catch (error) {
		console.error("Error registering user", error);
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const login = asyncHandler(async (req: Request, res: Response) => {
	try {
		const result = signinSchema.safeParse(req.body);

		if (!result.success) {
			throw new ApiError(400, "All fields are required");
		}

		const user = await User.findOne({ email: result.data.email });

		if (!user) {
			throw new ApiError(404, "User does not exist");
		}

		const isMatch = await user.isPasswordCorrect(result.data.password);

		if (!isMatch) {
			throw new ApiError(400, "Invalid credentials");
		}

		const accessToken = await user.generateToken();

		if (!accessToken) {
			throw new ApiError(500, "Unable to generate token");
		}

		const loggedInUser = await User.findById(user._id).select("-password");

		const options = {
			httpOnly: true,
			secure: true,
		};

		return res
			.status(200)
			.cookie("accessToken", accessToken, options)
			.json(
				new ApiResponse(
					200,
					{
						user: loggedInUser,
						accessToken,
					},
					"User logged in successfully"
				)
			);
	} catch (error) {
		console.error("Error logging in user", error);
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

export { login, register };
