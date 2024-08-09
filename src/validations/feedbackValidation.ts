import { z } from "zod";

export const feedbackSchema = z.object({
	bookingId: z.string({ message: "Invalid booking ID" }),
    rating: z.number().int({ message: "Invalid rating" }),
    feedback: z.string({ message: "Invalid feedback" }),
});
