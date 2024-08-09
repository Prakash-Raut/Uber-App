import { BookingRepo } from "../repositories/BookingRepo";
import { haversineDistance } from "../utils/distance";
import { BASIC_FARE, RATE_PER_KM } from "../utils/fare";
import { LocationService } from "./LocationService";

export class BookingService {
	private bookingRepo: BookingRepo;
	private locationService: LocationService;

	constructor() {
		this.bookingRepo = new BookingRepo();
		this.locationService = new LocationService();
	}

	async createBooking(
		passengerId: string,
		source: { latitude: number; longitude: number },
		destination: { latitude: number; longitude: number }
	) {
		const distance = haversineDistance(
			source.latitude,
			source.longitude,
			destination.latitude,
			destination.longitude
		);

		const fare = Math.floor(BASIC_FARE + distance * RATE_PER_KM);

		const booking = await this.bookingRepo.createBooking(
			passengerId,
			source,
			destination,
			fare,
			"PENDING"
		);

		return booking;
	}

	async findNearByDrivers(
		source: { latitude: number; longitude: number },
		radius = 5
	) {
		const longitude = source.longitude;
		const latitude = source.latitude;

		const radiusKm = radius;

		if (isNaN(longitude) || isNaN(latitude) || isNaN(radiusKm)) {
			throw new Error("Invalid coordinates or radius");
		}

		const nearByDrivers = await this.locationService.findNearByDrivers(
			longitude,
			latitude,
			radiusKm
		);

		return nearByDrivers;
	}

	async assignDriver(bookingId: string, driverId: string) {
		const booking = await this.bookingRepo.updateBookingStatus(
			bookingId,
			driverId,
			"CONFIRMED"
		);

		if (!booking) {
			throw new Error("Booking already confirmed or does not exist");
		}

		return booking;
	}

	async confirmBooking(bookingId: string, passengerId: string) {
		console.log(bookingId, passengerId);
		return "Booking confirmed";
	}
}
