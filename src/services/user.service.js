import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import storageService from "./storage.service.js";
import errorCodes from "../utils/errorCodes.js";

const updateUserProfile = async (userId, payload) => {
    const user = await User.findOne({ _id: userId });

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found", errorCodes.USER_NOT_FOUND);
    }

    const { profilePicture, fullName, phoneNumber } = payload;

    if (!profilePicture?.buffer && !fullName && !phoneNumber) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Fields are empty",
            errorCodes.VALIDATION_ERROR
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

        // Deleting the existing profile image, if available
        if (user.profilePicture?.fileId) {
            storageService.deleteFile(user.profilePicture?.fileId);
        }
    }

    if (uploadedProfilePic) {
        user.profilePicture = {
            url: uploadedProfilePic?.url,
            fileId: uploadedProfilePic?.fileId,
        };
    }
    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    return await user.save();
};

export default { updateUserProfile };
