import asyncHandler from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import errorCodes from "../utils/errorCodes.js";
import config from "../config/config.js";
import Share from "../models/share.model.js";
import File from "../models/file.model.js";

const authFileAccess = asyncHandler(async (req, res, next) => {
    const { token: fileAccessToken } = req.query;

    if (fileAccessToken) {
        try {
            const decoded = jwt.verify(fileAccessToken, config.JWT.FILE_ACCESS_TOKEN_SECRET);

            const file = await Share.findOne({
                _id: decoded.shareId,
                file: decoded.fileId,
                status: "active",
            })
                .populate("file", "file fileName type -_id")
                .select("_id")
                .lean();

            if (!file) {
                throw new Error();
            }

            req.file = file.file;
            return next();
        } catch (error) {
            // TODO: Implement a html page for it, if link is expired show it in a page so that everyone can understand
            throw new ApiError(StatusCodes.GONE, "This link has expired", errorCodes.LINK_EXPIRED);
        }
    }

    try {
        const { id: fileId } = req.params;
        const accessToken = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

        const decoded = jwt.verify(accessToken, config.JWT.ACCESS_TOKEN_SECRET);
        console.log(decoded);

        const file = await File.findOne({
            _id: fileId,
            createdBy: decoded.id,
        })
            .select("file fileName type -_id")
            .lean();

        if (!file) {
            throw new Error();
        }

        req.file = file;
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

export default authFileAccess;
