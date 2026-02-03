import asyncHandler from "../utils/AsyncHandler.js";
import File from "../models/file.model.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import errorCodes from "../utils/errorCodes.js";

const checkResourceAccess = asyncHandler(async (req, res, next) => {
    const file = await File.findById(req.params?.id).lean();

    if (!file) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "The file does not exist or has been deleted",
            errorCodes.NOT_FOUND
        );
    }

    const hasAccess = file?.createdBy?.toString() === req.user?.id;

    if (!hasAccess) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "You don't have permission to modify or access this file",
            errorCodes.UNAUTHORIZED
        );
    }

    req.file = file;
    next();
});

export default checkResourceAccess;
