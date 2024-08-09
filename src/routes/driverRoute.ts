import { Router } from "express";

const driverRouter = Router();

driverRouter.get("/bookings");
driverRouter.put("/locations");

export { driverRouter };
