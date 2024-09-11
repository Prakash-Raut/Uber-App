import { Router } from "express";
import { io } from "..";
import {
	confirmBooking,
	createBooking,
} from "../controllers/BookingController";
import { authMiddleware } from "../middlewares/authMiddleware";

const bookingRouter = Router();

bookingRouter.post("/create", authMiddleware, (req, res, next) =>
	createBooking(io)(req, res, next)
);
bookingRouter.post("/confirm", authMiddleware, (req, res, next) =>
	confirmBooking(io)(req, res, next)
);

export { bookingRouter };
