import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import logger from "../loggers/winston.logger.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const userSchema = new Schema(
	{
		avatar: String,
		fullName: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			match: ["/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/", "Invalid email"],
			unique: true,
			index: true,
			required: true,
		},
		phoneNumber: {
			type: String,
			trim: true,
			minLength: 10,
			maxLength: 13,
			required: true,
		},
		password: {
			type: String,
			trim: true,
			select: false,
			required: true,
		},
		refreshToken: String,
	},
	{ timestamps: true },
);

// Hash the password before saving (only if it was modified)
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const hashedPassword = await bcrypt.hash(this.password, 10);
		this.password = hashedPassword;

		next();
	} catch (error) {
		logger.error("Error while hashing the password using bcrypt", {
			event: "bcrypt_hashing_faild",
			reason: error.message,
		});

		next(new Error("Error while hashing the password using bcrypt"));
	}
});

userSchema.method.isPasswordCorrect = async function (plainTextPassword) {
	try {
		return await bcrypt.compare(plainTextPassword, this.password);
	} catch (error) {
		throw new Error("Incorrect password");
	}
};

userSchema.method.generateAccessToken = async function () {
	try {
		return jwt.sign(
			{
				id: this._id,
				email: this.email,
				phoneNumber: this.phoneNumber,
			},
			config.JWT.ACCESS_SECRET,
			{ expiresIn: config.JWT.ACCESS_TOKEN_EXPIRATION },
		);
	} catch (error) {
		throw new Error("Error while generating access token");
	}
};

userSchema.method.generateRefreshToken = async function () {
	try {
		return jwt.sign(
			{
				id: this._id,
				email: this.email,
				phoneNumber: this.phoneNumber,
			},
			config.JWT.REFRESH_TOKEN_SECRET,
			{
				expiresIn: config.JWT.REFRESH_TOKEN_EXPIRATION,
			},
		);
	} catch (error) {
		throw new Error("Error while generating refresh token");
	}
};

const User = model("User", userSchema);
export default User;
