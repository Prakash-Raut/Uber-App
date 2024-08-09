import { Router } from "express";
import {
	getDriverBookings,
	updateDriverLocation,
} from "../controllers/DriverController";
import { authMiddleware } from "../middlewares/authMiddleware";

const driverRouter = Router();

driverRouter.get("/bookings", authMiddleware, getDriverBookings);
driverRouter.put("/locations", authMiddleware, updateDriverLocation);

export { driverRouter };
