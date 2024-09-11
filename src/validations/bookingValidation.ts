import { z } from "zod";

export const bookingSchema = z.object({
	passengerId: z.string({ message: "ID must be a string" }),
	source: z.object({
		longitude: z
			.number({
				message: "Longitude must be a number between -180 and 180",
			})
			.min(-180, { message: "Longitude cannot be less than -180" })
			.max(180, { message: "Longitude cannot be more than 180" }),
		latitude: z
			.number({ message: "Latitude must be a number between -90 and 90" })
			.min(-90, { message: "Latitude cannot be less than -90" })
			.max(90, { message: "Latitude cannot be more than 90" }),
	}),
	destination: z.object({
		longitude: z
			.number({
				message: "Longitude must be a number between -180 and 180",
			})
			.min(-180, { message: "Longitude cannot be less than -180" })
			.max(180, { message: "Longitude cannot be more than 180" }),
		latitude: z
			.number({ message: "Latitude must be a number between -90 and 90" })
			.min(-90, { message: "Latitude cannot be less than -90" })
			.max(90, { message: "Latitude cannot be more than 90" }),
	}),
});
