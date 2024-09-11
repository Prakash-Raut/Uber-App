import { z } from "zod";

export const driverLocationUpdateSchema = z.object({
	longitude: z
		.number({ message: "Longitude must be a number" })
		.min(-180, { message: "Longitude cannot be less than -180" })
		.max(180, { message: "Longitude cannot be more than 180" }),
	latitude: z
		.number({ message: "Latitude must be a number" })
		.min(-90, { message: "Latitude cannot be less than -90" })
		.max(90, { message: "Latitude cannot be more than 90" }),
	driverId: z.string({ message: "Driver ID must be a string" }),
});
