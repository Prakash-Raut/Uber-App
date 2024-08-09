import express, { Request, Response } from "express";
import { join } from "node:path";
import { v1Router } from "./routes";

const app = express();

app.use(express.static(join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", v1Router);

app.get("/", (_: Request, res: Response) => {
	res.sendFile(join(__dirname, "public", "index.html"));
});

export { app };
