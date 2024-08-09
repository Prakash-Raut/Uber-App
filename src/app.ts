import express from "express";
import { join } from "node:path";

const app = express();

app.use(express.static(join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export { app };
