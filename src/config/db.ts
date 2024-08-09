import { connect } from "mongoose";
import { MONGO_URI, NODE_ENV } from "./env";

export async function connectDB() {
	try {
		if (NODE_ENV == "DEVELOPMENT") {
			await connect(MONGO_URI);
			console.log("Database connected...");
		}
	} catch (error) {
		console.log("Error connecting to database: ", error);
		process.exit(1);
	}
}
