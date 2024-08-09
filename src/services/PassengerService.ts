import { BookingRepo } from "../repositories/BookingRepo";
import { PassengerRepo } from "../repositories/PassengerRepo";

export class PassengerService {
	private passengerService;
	private bookingService;

	constructor() {
		this.passengerService = new PassengerRepo();
		this.bookingService = new BookingRepo();
	}

	async passengerBookings(passengerId: string) {
		const passenger = await this.passengerService.findPassenger(
			passengerId
		);

		if (!passenger) {
			throw new Error("Passenger not found");
		}

		return passenger;
	}

	async createFeedback(
		passengerId: string,
		bookingId: string,
		rating: number,
		feedback: string
	) {
		const booking = await this.bookingService.findBooking(
			bookingId,
			passengerId
		);

		if (!booking) {
			throw new Error("Booking not found");
		}

		booking.rating = rating;
		booking.feedback = feedback;

		await booking.save();
	}
}
