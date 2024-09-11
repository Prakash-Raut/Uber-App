import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document, Model, Schema, model } from "mongoose";
import { JWT_EXPIRY, JWT_SECRET, SALT_ROUNDS } from "../config/env";

export interface IUser extends Document {
	fullName: string;
	email: string;
	password: string;
	role: string;
	location: {
		type: string;
		coordinates: [number, number];
	};
}

export interface IUserMethods {
	isPasswordCorrect: (password: string) => Promise<boolean>;
	generateToken: () => Promise<string | undefined>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
	{
		fullName: {
			type: String,
			trim: true,
			index: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
			match: [
				/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
				"Please use a valid email address",
			],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		role: {
			type: String,
			enum: ["DRIVER", "PASSENGER"],
			default: "PASSENGER",
			required: [true, "Role is required"],
		},
		location: {
			type: {
				type: String,
				enum: ["Point"],
				default: "Point",
			},
			coordinates: {
				type: [Number],
				default: [0, 0],
			},
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
	next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ _id: this._id, email: this.email },
			JWT_SECRET,
			{ expiresIn: JWT_EXPIRY },
			(err, token) => {
				if (err) {
					return reject(err);
				}
				resolve(token);
			}
		);
	});
};

export const User = model<IUser, UserModel>("User", userSchema);
