import { redisClient } from "../config/redis";

interface ILocationService {
	setDriverSocketId(driverId: string, socketId: string): Promise<void>;
	getDriverSocketId(driverId: string): Promise<string | null>;
	deleteDriverSocketId(driverId: string): Promise<void>;
	addDriverLocation(
		driverId: string,
		longitude: number,
		latitude: number
	): Promise<void>;
	findNearByDrivers(
		longitude: number,
		latitude: number,
		radius: number
	): Promise<String[]>;
	storeNotifiedDrivers(bookingId: string, driverIds: string[]): Promise<void>;
	getNotifiedDrivers(bookingId: string): Promise<string[] | undefined>;
}

export class LocationService implements ILocationService {
	private client: typeof redisClient;

	constructor() {
		this.client = redisClient;
	}

	async setDriverSocketId(driverId: string, socketId: string) {
		await this.client.set(`Driver: ${driverId}`, socketId);
	}

	async getDriverSocketId(driverId: string) {
		return await this.client.get(`Driver: ${driverId}`);
	}

	async deleteDriverSocketId(driverId: string) {
		await this.client.del(`Driver: ${driverId}`);
	}

	async addDriverLocation(
		driverId: string,
		longitude: number,
		latitude: number
	) {
		try {
			const addedDriver = await this.client.geoAdd("Drivers", {
				longitude,
				latitude,
				member: driverId,
			});

			console.log("Geospatial data added successfully.", addedDriver);
		} catch (error) {
			console.log("Error adding geospatial data: ", error);
		}
	}

	async findNearByDrivers(
		longitude: number,
		latitude: number,
		radius: number
	) {
		try {
			const nearByDrivers = await this.client.geoSearch(
				"Drivers",
				{ longitude, latitude },
				{ radius, unit: "km" }
			);

			return nearByDrivers;
		} catch (error) {
			console.log("Error finding nearby drivers: ", error);
			throw error;
		}
	}

	async storeNotifiedDrivers(bookingId: string, driverIds: string[]) {
		try {
			for (const driverId of driverIds) {
				await this.client.sAdd(
					`NotifiedDrivers: ${bookingId}`,
					driverId
				);
			}

			console.log("Notified drivers successfully.");
		} catch (error) {
			console.log("Error storing notified drivers: ", error);
		}
	}

	async getNotifiedDrivers(bookingId: string) {
		try {
			return await this.client.sMembers(`NotifiedDrivers: ${bookingId}`);
		} catch (error) {
			console.log("Error getting notified drivers: ", error);
		}
	}
}
