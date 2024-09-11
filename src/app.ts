import cookieParser from "cookie-parser";
import express from "express";
import { v1Router } from "./routes";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", v1Router);

export { app };
