import { Booking } from "../models/Booking";

export class BookingRepo {
	private model: typeof Booking;

	constructor() {
		this.model = Booking;
	}

	async findBooking(bookingId: string, passengerId: string) {
		return await this.model.findOne({
			_id: bookingId,
			passenger: passengerId,
		});
	}

	async findBookingByUserId(userId: string, role: string) {
		switch (role) {
			case "DRIVER":
				return await this.model.findOne({ driver: userId });
			case "PASSENGER":
				return await this.model.findOne({ passenger: userId });
			default:
				return Promise.reject(new Error("Invalid role"));
		}
	}

	async createBooking(
		passengerId: string,
		source: { latitude: number; longitude: number },
		destination: { latitude: number; longitude: number },
		fare: number,
		status: string
	) {
		const booking = await this.model.create({
			passenger: passengerId,
			driver: null,
			source,
			destination,
			fare,
			status,
		});

		return booking;
	}

	async updateBookingStatus(
		bookingId: string,
		driverId: string,
		status: string
	) {
		const booking = await this.model.findOneAndUpdate(
			{ _id: bookingId },
			{ status, driver: driverId },
			{ new: true }
		);

		return booking;
	}
}
