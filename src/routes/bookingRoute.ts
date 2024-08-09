import { Router } from "express";
import { io } from "..";
import {
	confirmBooking,
	createBooking,
} from "../controllers/BookingController";
import { authMiddleware } from "../middlewares/authMiddleware";

const bookingRouter = Router();

bookingRouter.post("/create", authMiddleware, createBooking(io));
bookingRouter.get("/confirm", authMiddleware, confirmBooking(io));

export { bookingRouter };
