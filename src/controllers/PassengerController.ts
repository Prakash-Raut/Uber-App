import type { Request, Response } from "express";
import { Booking } from "../models/Booking";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { feedbackSchema } from "../validations/feedbackValidation";

const getPassengerBookings = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const { passengerId } = req.user;

			const passenger = await User.findOne({
				passenger: passengerId,
				role: "PASSENGER",
			});

			if (!passenger) {
				throw new ApiError(404, "Passenger not found");
			}

			const passengerBookings = await Booking.find({});

			if (!passengerBookings) {
				throw new ApiError(404, "No bookings found");
			}

			return res
				.status(200)
				.json(
					new ApiResponse(
						200,
						passengerBookings,
						"Passenger bookings retrieved successfully"
					)
				);
		} catch (error) {
			return res
				.status(500)
				.json(new ApiResponse(500, null, "Internal server error"));
		}
	}
);

const provideFeedback = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { passengerId } = req.user;

		const result = feedbackSchema.safeParse(req.body);

		if (!result.success) {
			throw new ApiError(400, "All fields are required");
		}

		const givenFeedback = await Booking.findOne({
			_id: result.data.bookingId,
			passenger: passengerId,
			rating: result.data.rating,
			feedback: result.data.feedback,
		});

		if (!givenFeedback) {
			throw new ApiError(404, "Booking not found");
		}

		return res
			.status(201)
			.json(
				new ApiResponse(
					201,
					givenFeedback,
					"Feedback provided successfully"
				)
			);
	} catch (error) {
		console.error("Error providing feedback", error);
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

export { getPassengerBookings, provideFeedback };
