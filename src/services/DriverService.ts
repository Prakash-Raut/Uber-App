import { DriverRepo } from "../repositories/DriverRepo";
import { LocationService } from "./LocationService";

export class DriverService {
	private driverRepo: DriverRepo;
	private locationService: LocationService;

	constructor() {
		this.driverRepo = new DriverRepo();
		this.locationService = new LocationService();
	}

	async getDriverBookings(driverId: string) {
		return await this.driverRepo.findDriverById(driverId);
	}

	async updateDriverLocation(
		driverId: string,
		longitude: number,
		latitude: number
	) {

		longitude = parseFloat(longitude.toString());
		latitude = parseFloat(latitude.toString());

		if (isNaN(longitude) || isNaN(latitude)) {
			throw new Error("Invalid coordinates");
		}

		await this.locationService.addDriverLocation(
			driverId,
			longitude,
			latitude
		);

		const updatedDriverLocation =
			await this.driverRepo.updateDriverLocation(
				driverId,
				longitude,
				latitude
			);

		if (!updatedDriverLocation) {
			throw new Error("Unable to update driver location");
		}

		return updatedDriverLocation;
	}
}
