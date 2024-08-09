import { Router } from "express";

const bookingRouter = Router();

bookingRouter.post("/create");
bookingRouter.get("/confirm");

export { bookingRouter };
