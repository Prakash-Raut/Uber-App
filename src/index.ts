import { createServer } from "http";
import { Server } from "socket.io";
import { app } from "./app";
import { connectDB } from "./config/db";
import { CORS_ORIGIN, PORT } from "./config/env";
import { connectRedis } from "./config/redis";
import { LocationService } from "./services/LocationService";

const server = createServer(app);

export const io = new Server(server, {
	cors: {
		origin: CORS_ORIGIN,
		credentials: true,
	},
});

server.listen(PORT, async () => {
	console.log(`Server is running on http://localhost:${PORT}`);
	await connectDB();
	await connectRedis();
});

const locationService = new LocationService();

io.on("connection", (socket) => {
	console.log("A user connected");

	socket.on("registerDriver", async (driverId: string) => {
		console.log(`Driver ${driverId} connected`);
		await locationService.setDriverSocketId(driverId, socket.id);
	});

	socket.on("disconnect", async (driverId: string) => {
		const driverSocketId = await locationService.getDriverSocketId(
			`Driver: ${driverId}`
		);

		if (driverSocketId) {
			console.log(`Driver ${driverId} disconnected`);
			await locationService.deleteDriverSocketId(`Driver: ${driverId}`);
		}
	});
});
