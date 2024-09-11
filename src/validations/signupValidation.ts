import { z } from "zod";

export const fullNameValidation = z
	.string({ message: "Name must be a string" })
	.min(3, { message: "Name must be at least 3 characters long" })
	.max(30, { message: "Name must be at most 30 characters long" });

export const emailValidation = z
	.string({ message: "Email must be a string" })
	.email({ message: "Invalid email address" });

export const passwordValidation = z
	.string({ message: "Password must be a string" })
	.min(6, { message: "Password must be at least 6 characters long" })
	.max(20, { message: "Password must be at most 20 characters long" });

export const roleValidation = z.enum(["DRIVER", "PASSENGER"], {
	message: "Role must be either 'DRIVER' or 'PASSENGER'",
});

export const signupSchema = z.object({
	fullName: fullNameValidation,
	email: emailValidation,
	password: passwordValidation,
	role: roleValidation,
});
