import { z } from "zod";

export const signinSchema = z.object({
	email: z
		.string({ message: "Email must be a string" })
		.email({ message: "Invalid email address" }),
	password: z
		.string({ message: "Password must be a string" })
		.min(6, { message: "Password must be at least 6 characters long" })
		.max(20, { message: "Password must be at most 20 characters long" }),
});
