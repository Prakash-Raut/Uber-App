import { Document, Schema, Types, model } from "mongoose";

export interface IBooking extends Document {
	passenger: Types.ObjectId;
	driver: Types.ObjectId;
	source: {
		latitude: number;
		longitude: number;
	};
	destination: {
		latitude: number;
		longitude: number;
	};
	fare: number;
	status?: string;
	rating?: number;
	feedback?: string;
}

const bookingSchema: Schema<IBooking> = new Schema(
	{
		passenger: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		driver: {
			type: Schema.Types.ObjectId,
			ref: "User",
			// required: true,
			default: null,
		},
		source: {
			latitude: {
				type: Number,
				required: true,
			},
			longitude: {
				type: Number,
				required: true,
			},
		},
		destination: {
			latitude: {
				type: Number,
				required: true,
			},
			longitude: {
				type: Number,
				required: true,
			},
		},
		fare: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ["PENDING", "CONFIRMED", "COMPLETED"],
			default: "PENDING",
		},
		rating: {
			type: Number,
			default: null,
		},
		feedback: {
			type: String,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

export const Booking = model<IBooking>("Booking", bookingSchema);
