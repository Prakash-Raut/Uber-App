import { User } from "../models/User";

export class DriverRepo {
	private model: typeof User;

	constructor() {
		this.model = User;
	}

	async getDriverBookings() {}

	async findDriverById(driverId: string) {
		return await this.model.findOne({ _id: driverId, role: "DRIVER" });
	}

	async updateDriverLocation(
		driverId: string,
		longitude: number,
		latitude: number
	) {
		const updatedDriverLocation = await this.model.findByIdAndUpdate(
			driverId,
			{
				location: {
					type: "Point",
					coordinates: [longitude, latitude],
				},
			},
			{ new: true }
		);

		return updatedDriverLocation;
	}
}
