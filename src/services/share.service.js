import nodemailer from "nodemailer";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import File from "../models/file.model.js";
import User from "../models/user.model.js";
import Share from "../models/share.model.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import errorCodes from "../utils/errorCodes.js";
import formatFileSize from "../views/js/formatFileSize.js";

// setInterval(
//     async () => {
//         const currentDateTime = Date.now();

//         Share.updateMany({});
//     },
//     2 * 60 * 1000
// );

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.SMTP.EMAIL,
        pass: config.SMTP.PASS,
    },
});

const getEmailTemplate = ({
    senderName,
    senderEmail,
    fileName,
    size,
    expiryDate,
    downloadLink,
}) => {
    return `
	<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">

    <!-- Email Wrapper -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc">
        <tr>
            <td align="center" style="padding: 48px 20px">
                
                <!-- Main Container -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    
                    <!-- Top Branding -->
                    <tr>
                        <td style="padding: 32px 40px 0;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td>
                                        <span style="font-size: 16px; font-weight: 700; color: #4f46e5; letter-spacing: -0.01em;"> Filemoon</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Header Section -->
                    <tr>
                        <td style="padding: 32px 40px;">
                            <h1 style="margin: 0; font-size: 22px; font-weight: 600; line-height: 1.3; color: #0f172a;">
                                <span style="text-transform: capitalize;">${senderName}</span> shared a file with you
                            </h1>
                            <p style="margin: 10px 0 0; font-size: 15px; color: #64748b; line-height: 1.5;">
                                A secure link has been generated for your access. Review the details below to download.
                            </p>
                        </td>
                    </tr>

                    <!-- Professional File Card -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                                <!-- Sender Info -->
                                <tr>
                                    <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; background-color: #fbfcfd;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="font-size: 13px; font-weight: 500; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Shared By</td>
                                                <td align="right" style="font-size: 14px; color: #475569;">${senderEmail}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- File Info -->
                                <tr>
                                    <td style="padding: 24px 20px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="40" valign="top">
                                                    <div style="width: 36px; height: 36px; background-color: #eef2ff; border-radius: 8px; text-align: center; line-height: 36px;">
                                                        <span style="font-size: 18px;">📄</span>
                                                    </div>
                                                </td>
                                                <td style="padding-left: 12px;">
                                                    <div style="font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 2px;">${fileName}</div>
                                                    <div style="font-size: 13px; color: #64748b;">${formatFileSize(size)} &bull; Expiring on ${moment(expiryDate).format("Do MMM YYYY, hh:mm a")}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Primary Action -->
                    <tr>
                        <td style="padding: 32px 40px 40px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td>
                                        <a href="${downloadLink}" target="_blank" style="display: block; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 24px; border-radius: 8px; text-align: center;">
                                            Download File
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 20px; text-align: center;">
                                        <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                                            🔒 This is a secure, encrypted transfer.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer Content -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom: 16px;">
                                        <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                                            Questions? Contact <a href="mailto:${senderEmail}" style="color: #4f46e5; text-decoration: none;">the sender</a> or visit our <a href="#" style="color: #4f46e5; text-decoration: none;">Help Center</a>.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                                            &copy; 2026 Filemoon Inc. All rights reserved.<br>
                                            <a href="#" style="color: #94a3b8; text-decoration: underline;">Privacy Policy</a> &nbsp;&bull;&nbsp; <a href="#" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <!-- End Main Container -->
            </td>
        </tr>
    </table>
</body>
	`;
};

const shareFile = async (user, payload) => {
    const { id: senderId, email: senderEmail } = user;
    let { email, fileId, expiry } = payload;
    email = email.trim();

    // Fetch file and sender info
    const [file, userInfo] = await Promise.all([
        File.findById(fileId).select("fileName type size -_id").lean(),
        User.findById(senderId).select("fullName -_id").lean(),
    ]);

    if (!file) {
        throw new ApiError(StatusCodes.NOT_FOUND, "File not found", errorCodes.NOT_FOUND);
    }

    // Token expiry in minutes
    const timestamp = new Date(expiry).getTime() - Date.now();
    const tokenExpiry = Math.floor(timestamp / 1000 / 60);

    try {
        const createdShare = await Share.create({
            from: senderId,
            to: email,
            file: fileId,
            expiry,
        });

        // Token to access file
        const fileAccessToken = jwt.sign(
            {
                shareId: createdShare?._id,
                fileId,
            },
            config.JWT.FILE_ACCESS_TOKEN_SECRET,
            { expiresIn: `${tokenExpiry}m` }
        );

        const downloadLink = `${config.SERVER_ORIGIN}/api/v1/files/${fileId}/download?token=${fileAccessToken}`;

        await transporter.sendMail({
            from: config.SMTP.EMAIL,
            to: email,
            subject: "Filemoon - New file received",
            html: getEmailTemplate({
                senderName: userInfo.fullName,
                fileName: file.fileName,
                size: file.size,
                expiryDate: expiry,
                senderEmail,
                downloadLink,
            }),
        });
    } catch (error) {
        console.error(error);

        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Faild to send mail",
            errorCodes.INTERNAL_SERVER_ERROR
        );
    }
};

const fetchShares = async (userId, pagination) => {
    const shares = await Share.find({ from: userId })
        .select("-from -updatedAt -__v")
        .populate("file", "fileName type category -_id")
        .sort({ createdAt: -1 })
        .lean();

    return shares;
};

export default { shareFile, fetchShares };
