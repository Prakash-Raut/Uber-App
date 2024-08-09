import type { Request, Response } from "express";
import { PassengerService } from "../services/PassengerService";
import { feedbackSchema } from "../validations/feedbackValidation";

const passengerService = new PassengerService();

async function getPassengerBookings(req: Request, res: Response) {
	try {
		const { id } = req.user;

		const bookings = await passengerService.passengerBookings(id);

		if (!bookings) {
			return res.status(404).json({
				statusCode: 404,
				success: false,
				message: "No bookings found",
			});
		}

		return res.status(201).json({
			statusCode: 201,
			success: true,
			message: "Bookings retrieved successfully",
			data: {},
		});
	} catch (error) {
		return res.status(400).json({
			statusCode: 400,
			success: false,
			message: "Unable to retrieve bookings",
		});
	}
}

async function provideFeedback(req: Request, res: Response) {
	try {
		const { bookingId, rating, feedback } = req.body;
		const { id } = req.user;

		const result = feedbackSchema.safeParse({
			bookingId,
			rating,
			feedback,
		});

		if (!result.success) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: result.error.message,
			});
		}

		const givenFeedback = await passengerService.createFeedback(
			id,
			result.data.bookingId,
			result.data.rating,
			result.data.feedback
		);

		return res.status(201).json({
			statusCode: 201,
			success: true,
			message: "Feedback submitted successfully",
			data: givenFeedback,
		});
	} catch (error) {
		return res.status(400).json({
			statusCode: 400,
			success: false,
			message: "Unable to provide feedback",
		});
	}
}

export { getPassengerBookings, provideFeedback };
