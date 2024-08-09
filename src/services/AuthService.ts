import { User } from "../models/User";

export class AuthService {
	private model: typeof User;

	constructor() {
		this.model = User;
	}

	async registerUser(email: string, password: string) {
		try {
			const existingUser = await this.model.findOne({ email });

			if (existingUser) {
				throw new Error("User already exists");
			}

			const user = await User.create({ email, password });

			if (!user) {
				throw new Error("Unable to create user");
			}

			return user;
		} catch (error) {
			throw new Error("Unable to register user");
		}
	}

	async loginUser(email: string, password: string) {
		try {
			const user = await this.model.findOne({ email });

			if (!user) {
				throw new Error("User not found or invalid email");
			}

			const isMatch = await user.isPasswordCorrect(password);

			if (!isMatch) {
				throw new Error("Invalid password");
			}

			const token = await user.generateToken();

			if (!token) {
				throw new Error("Unable to generate token");
			}

			return { user, token };
		} catch (error) {
			throw new Error("Login failed");
		}
	}
}
