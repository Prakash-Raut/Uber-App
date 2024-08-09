import { Router } from "express";

const passengerRouter = Router();

passengerRouter.get("/bookings");
passengerRouter.post("/feedback");

export { passengerRouter };
