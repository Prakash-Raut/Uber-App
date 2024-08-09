import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { signinSchema } from "../validations/signinValidation";

const authService = new AuthService();

async function register(req: Request, res: Response) {
	try {
		const { email, password } = req.body;

		const result = signinSchema.safeParse({
			email,
			password,
		});

		if (!result.success) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: result.error.message,
			});
		}

		const user = await authService.registerUser(
			result.data.email,
			result.data.password
		);

		if (!user) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: "Unable to register user || User already exists",
			});
		}

		return res.status(201).json({
			statusCode: 201,
			success: true,
			message: "User registered successfully",
		});
	} catch (error) {
		return res.status(400).json({
			statusCode: 400,
			success: false,
			message: "Unable to register user || User already exists",
		});
	}
}

async function login(req: Request, res: Response) {
	try {
		const { email, password } = req.body;

		const result = signinSchema.safeParse({
			email,
			password,
		});

		if (!result.success) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: result.error.message,
			});
		}

		const { user, token } = await authService.loginUser(
			result.data.email,
			result.data.password
		);

		return res.status(200).json({
			statusCode: 200,
			success: true,
			message: "User logged in successfully",
			data: {
				user,
				token,
			},
		});
	} catch (error) {
		return res.status(400).json({
			statusCode: 400,
			success: false,
			message: "Unable to login user, please check your credentials",
		});
	}
}

export { login, register };
