import { z } from "zod";

export const driverLocationUpdateSchema = z.object({
	longitude: z
		.number({ message: "Longitude must be a number" })
		.min(-180, {
			message: "Longitude must be greater than or equal to -180",
		})
		.max(180, { message: "Longitude must be less than or equal to 180" }),
	latitude: z
		.number({ message: "Latitude must be a number" })
		.min(-90, { message: "Latitude must be greater than or equal to -90" })
		.max(90, { message: "Latitude must be less than or equal to 90" }),
	driverId: z.string({ message: "Driver ID must be a string" }),
});
