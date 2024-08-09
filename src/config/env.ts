import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = String(process.env.NODE_ENV);
const PORT = Number(process.env.PORT);
const CORS_ORIGIN = String(process.env.CORS_ORIGIN);
const MONGO_URI = String(process.env.MONGO_URI);
const REDIS_PORT = Number(process.env.REDIS_PORT);
const REDIS_HOST = String(process.env.REDIS_HOST) || "127.0.0.1";
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const JWT_SECRET = String(process.env.JWT_SECRET);
const JWT_EXPIRY = String(process.env.JWT_EXPIRY);

export {
	CORS_ORIGIN,
	JWT_EXPIRY,
	JWT_SECRET,
	MONGO_URI,
	NODE_ENV,
	PORT,
	REDIS_HOST,
	REDIS_PORT,
	SALT_ROUNDS,
};
