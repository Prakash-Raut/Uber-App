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
		source: { longitude: number; latitude: number },
		radius: number
	): Promise<[string, [string, string]][]>;
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
			console.log("Add Driver Location: ", longitude, latitude, driverId);

			await redisClient.zRem("Drivers", driverId);

			const addedDriver = await redisClient.geoAdd("Drivers", {
				longitude,
				latitude,
				member: driverId,
			});

			console.log("Geospatial data added successfully.", addedDriver);
		} catch (error) {
			console.log("Error adding geospatial data: ", error);
		}
	}

	async removeDriverLocation(driverId: string) {
		try {
			const removedDriver = await this.client.zRem("Drivers", driverId);

			console.log("Geospatial data removed successfully.", removedDriver);
		} catch (error) {
			console.log("Error removing driver location: ", error);
		}
	}

	async findNearByDrivers(
		source: { longitude: number; latitude: number },
		radius: number
	) {
		try {
			console.log(
				"Source Coordinates: ",
				source.longitude,
				source.latitude
			);
			console.log("RadiusKM: ", radius);

			const nearByDrivers = (await this.client.sendCommand([
				"GEORADIUS",
				"Drivers",
				source.longitude.toString(),
				source.latitude.toString(),
				radius.toString(),
				"km",
				"WITHCOORD",
			])) as [string, [string, string]][];

			return nearByDrivers;
		} catch (error) {
			console.log("Error finding nearby drivers: ", error);
			throw error;
		}
	}

	async storeNotifiedDrivers(bookingId: string, driverIds: string[]) {
		try {
			for (const driverId of driverIds) {
				const addedDriverCount = await this.client.sAdd(
					`NotifiedDrivers: ${bookingId}`,
					driverId
				);
				console.log(
					"Added driver to notified drivers: ",
					addedDriverCount
				);
			}

			console.log("Notified drivers: ", driverIds);

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
