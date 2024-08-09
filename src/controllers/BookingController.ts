import type { Request, Response } from "express";
import { Server } from "socket.io";
import { BookingService } from "../services/BookingService";
import { LocationService } from "../services/LocationService";
import { bookingSchema } from "../validations/bookingValidation";

const bookingService = new BookingService();
const locationService = new LocationService();

const createBooking = (io: Server) => async (req: Request, res: Response) => {
	try {
		const { id } = req.user;
		const { source, destination } = req.body;

		const result = bookingSchema.safeParse({
			id,
			source,
			destination,
		});

		if (!result.success) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: result.error.message,
			});
		}

		const booking = await bookingService.createBooking(
			result.data.id,
			result.data.source,
			result.data.destination
		);

		if (!booking) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: "Unable to create booking",
			});
		}

		const nearByDrivers = await bookingService.findNearByDrivers(result.data.source);
		const driverIds: string[] = [];

		if (!nearByDrivers) {
			return res.status(200).json({
				statusCode: 200,
				success: true,
				message: "No drivers available",
				data: booking,
			});
		}

		for await (const driver of nearByDrivers) {
			const driverSocketId = await locationService.getDriverSocketId(
				driver[0]
			);

			if (driverSocketId) {
				driverIds.push(driver[0]);
				io.to(driverSocketId).emit("newBooking", {
					bookingId: booking._id,
					source,
					destination,
				});
			}
		}

		await locationService.storeNotifiedDrivers(
			booking._id as string,
			driverIds
		);

		return res.status(201).json({
			statusCode: 201,
			success: true,
			message: "Booking created successfully",
			data: booking,
		});
	} catch (error) {
		res.status(400).json({
			statusCode: 400,
			success: false,
			message: "Unable to create booking error",
		});
	}
};

const confirmBooking = (io: Server) => async (req: Request, res: Response) => {
	try {
		const { bookingId } = req.body;
		const { id } = req.user;

		const booking = await bookingService.assignDriver(bookingId, id);

		if (!booking) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: "Unable to assign driver",
			});
		}

		const notifiedDriverIds = await locationService.getNotifiedDrivers(
			bookingId
		);

		if (!notifiedDriverIds) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: "Unable to notify drivers",
			});
		}

		for (const driverId of notifiedDriverIds) {
			const driverSocketId = await locationService.getDriverSocketId(
				driverId[0]
			);

			if (driverSocketId) {
				if (driverId == id) {
					io.to(driverSocketId).emit("rideConfirmed", {
						bookingId,
						driverId: id,
					});
				} else {
					io.to(driverSocketId).emit("removeBooking", {
						bookingId,
					});
				}
			}
		}

		return res.status(200).json({
			statusCode: 200,
			success: true,
			message: "Booking confirmed successfully",
			data: booking,
		});
	} catch (error) {
		res.status(400).json({
			statusCode: 400,
			success: false,
			message: "Unable to confirm booking",
		});
	}
};

export { confirmBooking, createBooking };
