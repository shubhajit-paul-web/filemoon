import asyncHandler from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import errorCodes from "../utils/errorCodes.js";
import config from "../config/config.js";
import Share from "../models/share.model.js";
import File from "../models/file.model.js";

// Link expired error page UI
const linkExpiredPageUI = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Access Expired | Secure File Share</title>
        <!-- We use one external font for a professional look, but all styling is inline -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f9fafb; display: flex; align-items: center; justify-content: center; min-height: 100vh; color: #1f2937;">

        <div style="text-align: center; padding: 40px; max-width: 400px; width: 90%;">
            
            <!-- The "Broken Bridge" Icon -->
            <div style="margin-bottom: 24px;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                    <circle cx="12" cy="12" r="10" stroke="#9ca3af" stroke-width="1.5"/>
                    <path d="M12 8V12L15 15" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M18 6L6 18" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
                </svg>
            </div>

            <!-- The Message -->
            <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 12px 0; color: #111827;">
                This link has expired
            </h1>
            
            <p style="font-size: 16px; line-height: 1.5; color: #6b7280; margin: 0 0 32px 0;">
                For security reasons, shared files are only available for a limited time. This link is no longer active.
            </p>

            <!-- Technical Context (Helps user understand it's a security feature) -->
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb;">
                <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0; font-weight: 600;">
                    Security Policy
                </p>
                <p style="font-size: 13px; color: #4b5563; margin: 0;">
                    Automated link self-destruction enabled.
                </p>
            </div>

            <!-- Subtle Branding -->
            <p style="margin-top: 48px; font-size: 12px; color: #9ca3af;">
                Protected by Filemoon Secure Transfer
            </p>

        </div>

    </body>
    </html>
`;

const authFileAccess = asyncHandler(async (req, res, next) => {
    const { token: fileAccessToken } = req.query;

    // Shared file access
    if (fileAccessToken) {
        try {
            const decoded = jwt.verify(fileAccessToken, config.JWT.FILE_ACCESS_TOKEN_SECRET);

            const share = await Share.findOne({
                _id: decoded.shareId,
                file: decoded.fileId,
                status: "active",
            })
                .populate("file", "file fileName type -_id")
                .select("_id")
                .lean();

            if (typeof share?.file !== "object") {
                throw new Error();
            }

            req.file = share.file;
            return next();
        } catch (error) {
            return res.send(linkExpiredPageUI);
        }
    }

    // My created file access
    try {
        const { id: fileId } = req.params;
        const accessToken = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

        const decoded = jwt.verify(accessToken, config.JWT.ACCESS_TOKEN_SECRET);

        const file = await File.findOne({
            _id: fileId,
            createdBy: decoded.id,
        })
            .select("file fileName type -_id")
            .lean();

        if (!file) throw new Error();

        req.file = file;
        return next();
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
