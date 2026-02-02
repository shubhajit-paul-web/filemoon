import nodemailer from "nodemailer";
import config from "../config/config.js";
import Share from "../models/share.model.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import errorCodes from "../utils/errorCodes.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.SMTP.EMAIL,
        pass: config.SMTP.PASS,
    },
});

const getEmailTemplate = (fileLink) => {
    return `
        <body
		style="
			margin: 0;
			padding: 0;
			background-color: #f3f4f6;
			font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		">
		<!-- Preview Text (hidden) -->
		<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all">
			{{sender_email}} has shared a file with you on Filemoon. Click to download securely.
			&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
		</div>

		<!-- Email Wrapper -->
		<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6">
			<tr>
				<td align="center" style="padding: 40px 16px">
					<!-- Main Container -->
					<table
						role="presentation"
						width="100%"
						cellpadding="0"
						cellspacing="0"
						style="
							max-width: 560px;
							background-color: #ffffff;
							border-radius: 12px;
							box-shadow:
								0 4px 6px -1px rgba(0, 0, 0, 0.1),
								0 2px 4px -1px rgba(0, 0, 0, 0.06);
							overflow: hidden;
						">
						<!-- Header with Gradient -->
						<tr>
							<td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px 40px; text-align: center">
								<!-- Logo -->
								<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td align="center">
											<div style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); padding: 12px 16px; border-radius: 10px">
												<span style="font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px">🌙 Filemoon</span>
											</div>
											<p style="margin: 12px 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.85); font-weight: 400">Secure File Sharing Platform</p>
										</td>
									</tr>
								</table>
							</td>
						</tr>

						<!-- Main Content -->
						<tr>
							<td style="padding: 40px 40px 32px">
								<!-- Notification Badge -->
								<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td align="center" style="padding-bottom: 24px">
											<span
												style="
													display: inline-block;
													background-color: #dbeafe;
													color: #1e40af;
													font-size: 12px;
													font-weight: 600;
													padding: 6px 14px;
													border-radius: 20px;
													text-transform: uppercase;
													letter-spacing: 0.5px;
												">
												📥 New File Received
											</span>
										</td>
									</tr>
								</table>

								<!-- Greeting -->
								<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td style="text-align: center; padding-bottom: 24px">
											<h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #111827; line-height: 1.3">Someone shared a file with you</h1>
											<p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.5">You've received a secure file transfer</p>
										</td>
									</tr>
								</table>

								<!-- Sender Card -->
								<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 10px; margin-bottom: 24px">
									<tr>
										<td style="padding: 20px">
											<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
												<tr>
													<td width="48" valign="top">
														<!-- Avatar Circle -->
														<div
															style="
																width: 44px;
																height: 44px;
																background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
																border-radius: 50%;
																text-align: center;
																line-height: 44px;
															">
															<span style="color: #ffffff; font-size: 18px; font-weight: 600">{{sender_initial}}</span>
														</div>
													</td>
													<td style="padding-left: 14px; vertical-align: middle">
														<p style="margin: 0 0 2px; font-size: 14px; font-weight: 600; color: #111827">Shared by</p>
														<p style="margin: 0; font-size: 14px; color: #4b5563">{{sender_email}}</p>
													</td>
												</tr>
											</table>
										</td>
									</tr>
								</table>

								<!-- File Details Card -->
								<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 10px; margin-bottom: 24px">
									<tr>
										<td style="padding: 20px">
											<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
												<tr>
													<td width="48" valign="top">
														<!-- File Icon -->
														<div style="width: 44px; height: 44px; background-color: #eff6ff; border-radius: 10px; text-align: center; line-height: 44px">
															<span style="font-size: 20px">📄</span>
														</div>
													</td>
													<td style="padding-left: 14px; vertical-align: middle">
														<p style="margin: 0 0 4px; font-size: 15px; font-weight: 600; color: #111827">{{file_name}}</p>
														<p style="margin: 0; font-size: 13px; color: #6b7280">{{file_size}}</p>
													</td>
												</tr>
											</table>
										</td>
									</tr>
								</table>

								<!-- CTA Button -->
								<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td align="center" style="padding-bottom: 24px">
											<!--[if mso]>
												<v:roundrect
													xmlns:v="urn:schemas-microsoft-com:vml"
													xmlns:w="urn:schemas-microsoft-com:office:word"
													href="{{download_link}}"
													style="height: 52px; v-text-anchor: middle; width: 280px"
													arcsize="12%"
													stroke="f"
													fillcolor="#2563eb">
													<w:anchorlock />
													<center style="color: #ffffff; font-family: sans-serif; font-size: 16px; font-weight: bold">Download File</center>
												</v:roundrect>
											<![endif]-->
											<!--[if !mso]><!-->
											<a
												href="{{download_link}}"
												target="_blank"
												style="
													display: inline-block;
													background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
													color: #ffffff;
													text-decoration: none;
													font-size: 15px;
													font-weight: 600;
													padding: 14px 48px;
													border-radius: 8px;
													box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.35);
												">
												⬇️&nbsp;&nbsp;Download File
											</a>
											<!--<![endif]-->
										</td>
									</tr>
								</table>

								<!-- Expiry Warning -->
								<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 8px; margin-bottom: 20px">
									<tr>
										<td style="padding: 14px 18px">
											<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
												<tr>
													<td width="24" valign="top">
														<span style="font-size: 16px">⏰</span>
													</td>
													<td style="padding-left: 10px">
														<p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5"><strong>Link expires:</strong> {{expiry_date}}</p>
													</td>
												</tr>
											</table>
										</td>
									</tr>
								</table>

								<!-- Security Notice -->
								<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td align="center" style="padding-top: 8px">
											<p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.6">🔒 This link is private and can only be accessed by you</p>
										</td>
									</tr>
								</table>
							</td>
						</tr>

						<!-- Divider -->
						<tr>
							<td style="padding: 0 40px">
								<div style="border-top: 1px solid #e5e7eb"></div>
							</td>
						</tr>

						<!-- Footer -->
						<tr>
							<td style="padding: 28px 40px 32px">
								<!-- Help Text -->
								<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td align="center" style="padding-bottom: 20px">
											<p style="margin: 0 0 6px; font-size: 13px; color: #6b7280; line-height: 1.6">
												Questions about this file? Reply to this email or contact the sender directly.
											</p>
											<p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.5">If you don't recognize the sender, you can safely ignore this email.</p>
										</td>
									</tr>
								</table>

								<!-- Footer Links -->
								<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td align="center" style="padding-bottom: 16px">
											<a
												href="{{help_link}}"
												style="display: inline-block; color: #6b7280; text-decoration: none; font-size: 12px; padding: 0 10px; border-right: 1px solid #d1d5db"
												>Help Center</a
											>
											<a
												href="{{privacy_link}}"
												style="display: inline-block; color: #6b7280; text-decoration: none; font-size: 12px; padding: 0 10px; border-right: 1px solid #d1d5db"
												>Privacy Policy</a
											>
											<a href="{{terms_link}}" style="display: inline-block; color: #6b7280; text-decoration: none; font-size: 12px; padding: 0 10px">Terms of Service</a>
										</td>
									</tr>
								</table>

								<!-- Copyright -->
								<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td align="center">
											<p style="margin: 0 0 4px; font-size: 12px; color: #9ca3af">© 2026 Filemoon. All rights reserved.</p>
											<p style="margin: 0; font-size: 11px; color: #d1d5db">Secure file sharing made simple.</p>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
					<!-- End Main Container -->

					<!-- Unsubscribe Link -->
					<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px">
						<tr>
							<td align="center" style="padding: 24px 40px">
								<p style="margin: 0; font-size: 11px; color: #9ca3af; line-height: 1.5">
									You received this email because someone shared a file with you on Filemoon.<br />
									<a href="{{unsubscribe_link}}" style="color: #6b7280; text-decoration: underline">Unsubscribe</a> from these notifications.
								</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
    `;
};

const shareFile = async (userId, payload) => {
    let { email, fileId } = payload;
    email = email.trim();

    try {
        await transporter.sendMail({
            from: config.SMTP.EMAIL,
            to: email,
            subject: "Filemoon - New file received",
            html: getEmailTemplate(),
        });

        return await Share.create({
            from: userId,
            to: email,
            file: fileId,
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

export default { shareFile };
