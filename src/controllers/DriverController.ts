import type { Request, Response } from "express";
import { DriverService } from "../services/DriverService";
import { driverLocationUpdateSchema } from "../validations/driverValidation";

const driverService = new DriverService();

async function getDriverBookings(req: Request, res: Response) {
	console.log(req, res);
	return "getDriverBookings";
}

async function updateDriverLocation(req: Request, res: Response) {
	try {
		const { longitude, latitude } = req.body;
		const { id } = req.user;

		const result = driverLocationUpdateSchema.safeParse({
			longitude,
			latitude,
			driverId: id,
		});

		if (!result.success) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: "Invalid data",
				errors: result.error.issues,
			});
		}

		const updatedDriverLocation = await driverService.updateDriverLocation(
			result.data.driverId,
			result.data.longitude,
			result.data.latitude
		);

		if (!updatedDriverLocation) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: "Unable to update driver location",
			});
		}

		return res.status(200).json({
			statusCode: 200,
			success: true,
			message: "Driver location updated successfully",
			data: updatedDriverLocation,
		});
	} catch (error) {
		res.status(400).json({
			statusCode: 400,
			success: false,
			message: "Unable to update driver location",
		});
	}
}

export { getDriverBookings, updateDriverLocation };
