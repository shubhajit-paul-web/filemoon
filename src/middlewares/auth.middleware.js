import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import errorCodes from "../utils/errorCodes.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const authUser = asyncHandler(async (req, res, next) => {
    const accessToken =
        req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer ").trim();

    if (!accessToken) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "Authentication required. Please login to access this resource.",
            errorCodes.ACCESS_TOKEN_NOT_FOUND
        );
    }

    try {
        const decoded = jwt.verify(accessToken, config.JWT.ACCESS_TOKEN_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(
                StatusCodes.UNAUTHORIZED,
                "Session expired. Please login again.",
                errorCodes.INVALID_ACCESS_TOKEN
            );
        }

        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "Invalid access token. Please login again.",
            errorCodes.INVALID_ACCESS_TOKEN
        );
    }
});

export default authUser;
