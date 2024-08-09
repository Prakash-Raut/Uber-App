import { User } from "../models/User";

export class PassengerRepo {
	private model: typeof User;

	constructor() {
		this.model = User;
	}

	async findPassenger(passengerId: string) {
		return await this.model.findOne({
			passenger: passengerId,
			role: "PASSENGER",
		});
	}
}
