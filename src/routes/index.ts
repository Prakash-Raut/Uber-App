import { Router } from "express";
import { bookingRouter } from "./bookingRoute";
import { driverRouter } from "./driverRoute";
import { userRouter } from "./userRoute";

const v1Router = Router();

v1Router.use("/users", userRouter);
v1Router.use("/bookings", bookingRouter);
v1Router.use("/drivers", driverRouter);

export { v1Router };
