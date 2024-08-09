import { createClient } from "redis";
import { REDIS_HOST, REDIS_PORT } from "./env";

export const redisClient = createClient({
	url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

export async function connectRedis() {
	try {
		await redisClient.connect();
		console.log("Redis Connected...");
	} catch (error) {
		console.log("Error connecting to Redis: ", error);
		process.exit(1);
	}
}
