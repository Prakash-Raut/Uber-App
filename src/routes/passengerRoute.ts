import { Router } from "express";
import {
	getPassengerBookings,
	provideFeedback,
} from "../controllers/PassengerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const passengerRouter = Router();

passengerRouter.get("/bookings", authMiddleware, getPassengerBookings);
passengerRouter.post("/feedback", authMiddleware, provideFeedback);

export { passengerRouter };
