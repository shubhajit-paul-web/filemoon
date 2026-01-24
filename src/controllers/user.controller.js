import asyncHandler from "../utils/AsyncHandler.js";
import userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/ApiResponse.js";

const updateUserProfile = asyncHandler(async (req, res) => {
    const updatedUserProfile = await userService.updateUserProfile(req.user?.id, {
        ...(req.body || {}),
        profilePicture: req.file,
    });

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("User profile updated successfully", updatedUserProfile));
});

export default { updateUserProfile };
