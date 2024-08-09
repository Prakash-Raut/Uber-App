import { Router } from "express";
import { login, register } from "../controllers/UserController";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);

export { userRouter };
