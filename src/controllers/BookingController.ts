import type { Request, Response } from "express";
import type { Server } from "socket.io";
import { Booking } from "../models/Booking";
import { LocationService } from "../services/LocationService";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { haversineDistance } from "../utils/distance";
import { BASIC_FARE, RATE_PER_KM } from "../utils/fare";
import { bookingSchema } from "../validations/bookingValidation";

const locationService = new LocationService();

const createBooking = (io: Server) =>
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { passengerId } = req.body;
			const { source, destination } = req.body;

			const result = bookingSchema.safeParse({
				passengerId,
				source,
				destination,
			});

			if (!result.success) {
				throw new ApiError(400, "All fields are required");
			}

			const distance = haversineDistance(
				result.data.source.latitude,
				result.data.source.longitude,
				result.data.destination.latitude,
				result.data.destination.longitude
			);

			console.log("Total distance: ", distance);

			const fare = Math.floor(BASIC_FARE + distance * RATE_PER_KM);

			console.log("Total price: ", fare);

			const booking = await Booking.create({
				passenger: result.data.passengerId,
				source: result.data.source,
				destination: result.data.destination,
				fare,
				status: "PENDING",
			});

			if (!booking) {
				throw new ApiError(
					400,
					"Something went wrong while creating booking"
				);
			}

			const radiusKm: number = 20;

			const nearByDrivers = await locationService.findNearByDrivers(
				result.data.source,
				radiusKm
			);

			const driverIds: string[] = [];

			console.log("Nearby Drivers: ", nearByDrivers);

			if (!nearByDrivers || nearByDrivers.length === 0) {
				throw new ApiError(400, "No drivers found nearby");
			}

			for await (const driver of nearByDrivers) {
				const driverSocketId = await locationService.getDriverSocketId(
					driver[0]
				);

				if (!driverSocketId) {
					console.log(
						`Driver ${driver[0]} does not have a socket ID.`
					);
					continue;
				}

				console.log("Driver Socket Id :: ", driverSocketId);

				if (driverSocketId) {
					driverIds.push(driver[0]);
					io.to(driverSocketId).emit("newBooking", {
						bookingId: booking.id,
						source: booking.source,
						destination: booking.destination,
						fare: booking.fare,
					});
				}
			}

			await locationService.storeNotifiedDrivers(booking.id, driverIds);

			return res
				.status(201)
				.json(
					new ApiResponse(
						201,
						booking,
						"Booking created successfully"
					)
				);
		} catch (error) {
			console.error("Error creating booking", error);
			res.status(500).json(
				new ApiResponse(500, null, "Internal server error")
			);
		}
	});

const confirmBooking = (io: Server) =>
	asyncHandler(async (req: Request, res: Response) => {
		try {
			const { bookingId } = req.body;
			const { id } = req.user;

			//update booking status
			const updatedBookingStatus = await Booking.findByIdAndUpdate(
				bookingId,
				{
					driver: id,
					status: "CONFIRMED",
				}
			);

			if (!updatedBookingStatus) {
				throw new ApiError(400, "Booking not found");
			}

			const notifiedDriverIds = await locationService.getNotifiedDrivers(
				bookingId
			);

			if (!notifiedDriverIds) {
				throw new ApiError(400, "No drivers notified");
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

			return res
				.status(200)
				.json(
					new ApiResponse(
						200,
						updatedBookingStatus,
						"Booking confirmed successfully"
					)
				);
		} catch (error) {
			console.error("Error confirming booking", error);
			res.status(500).json(
				new ApiResponse(500, null, "Internal server error")
			);
		}
	});

export { confirmBooking, createBooking };
