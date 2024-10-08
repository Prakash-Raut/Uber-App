import type { Request, Response } from "express";
import { Booking } from "../models/Booking";
import { User } from "../models/User";
import { LocationService } from "../services/LocationService";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { driverLocationUpdateSchema } from "../validations/driverValidation";

const locationService = new LocationService();

const getDriverBookings = asyncHandler(async (req: Request, res: Response) => {
	const { id: driverId } = req.user;

	const driver = await User.findOne({ _id: driverId, role: "DRIVER" });

	if (!driver) {
		throw new ApiError(404, "Driver not found");
	}

	const driverBookings = await Booking.find({ driver: driverId });

	if (!driverBookings) {
		throw new ApiError(404, "No bookings found");
	}

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				driverBookings,
				"Driver bookings retrieved successfully"
			)
		);
});

const updateDriverLocation = asyncHandler(
	async (req: Request, res: Response) => {
		const result = driverLocationUpdateSchema.safeParse(req.body);

		if (!result.success) {
			throw new ApiError(400, "All fields are required");
		}

		let { longitude, latitude, driverId } = result.data;

		longitude = parseFloat(longitude.toString());
		latitude = parseFloat(latitude.toString());

		if (isNaN(longitude) || isNaN(latitude)) {
			throw new ApiError(400, "Invalid coordinates");
		}

		await locationService.addDriverLocation(driverId, longitude, latitude);

		const updatedDriverLocation = await User.findByIdAndUpdate(driverId, {
			location: {
				type: "Point",
				coordinates: [longitude, latitude],
			},
		}).select("-password");

		if (!updatedDriverLocation) {
			throw new ApiError(400, "Unable to update driver location");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					updatedDriverLocation,
					"Driver location updated successfully"
				)
			);
	}
);

export { getDriverBookings, updateDriverLocation };
