import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import errorCodes from "../utils/errorCodes.js";
import storageService from "./storage.service.js";
import logger from "../loggers/winston.logger.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId).select("email");

        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User not found", errorCodes.USER_NOT_FOUND);
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        await User.findByIdAndUpdate(userId, { refreshToken });

        return { accessToken, refreshToken };
    } catch (error) {
        logger.error("Error while generating access and refresh token", {
            event: "tokens_generation_faild",
            reason: error.message,
        });

        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Internal server error, try again after some time!",
            errorCodes.INTERNAL_SERVER_ERROR,
            false
        );
    }
};

const registerUser = async (payload) => {
    const { profilePicture, fullName, email, phoneNumber, password } = payload;

    const isUserAlreadyExists = await User.exists({
        $or: [{ email }, { phoneNumber }],
    }).lean();

    if (isUserAlreadyExists) {
        throw new ApiError(
            StatusCodes.CONFLICT,
            "Email or phone number already exists",
            errorCodes.USER_ALREADY_EXISTS
        );
    }

    let uploadedProfilePic;

    if (profilePicture?.buffer) {
        if (!profilePicture?.mimetype?.startsWith("image/")) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                "Invalid profile picture. Only image files (JPEG, PNG, etc.) are allowed",
                errorCodes.VALIDATION_ERROR
            );
        }

        uploadedProfilePic = await storageService.uploadProfilePicture(profilePicture);
    }

    const registeredUser = await User.create({
        profilePicture: {
            url: uploadedProfilePic?.url,
            fileId: uploadedProfilePic?.fileId,
        },
        fullName,
        email,
        phoneNumber,
        password,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(registeredUser?._id);

    return { registeredUser, accessToken, refreshToken };
};

const loginUser = async (payload) => {
    const { email, password } = payload;

    const user = await User.findOne({ email }).select("+password -refreshToken");

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found", errorCodes.USER_NOT_FOUND);
    }

    const isCorrectPassword = await user.isPasswordCorrect(password?.toString());

    if (!isCorrectPassword) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Incorrect password",
            errorCodes.INCORRECT_PASSWORD
        );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id);

    return { user, accessToken, refreshToken };
};

export default { generateAccessAndRefreshToken, registerUser, loginUser };
