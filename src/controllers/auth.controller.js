import asyncHandler from "../utils/AsyncHandler.js";
import authService from "../services/auth.service.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/ApiResponse.js";
import { ACCESS_TOKEN_COOKIE_EXP, REFRESH_TOKEN_COOKIE_EXP, setCookieOptions } from "../utils/constants.js";

const registerUser = asyncHandler(async (req, res) => {
	const registeredUser = await authService.registerUser({
		...(req.body || {}),
		profilePicture: req.file,
	});

	const { accessToken, refreshToken } = await authService.generateAccessAndRefreshToken(registeredUser?._id);

	res.cookie("accessToken", accessToken, setCookieOptions(ACCESS_TOKEN_COOKIE_EXP));
	res.cookie("refreshToken", refreshToken, setCookieOptions(REFRESH_TOKEN_COOKIE_EXP));

	return res.status(StatusCodes.CREATED).json(ApiResponse.success("Registered successfully", registeredUser));
});

export default { registerUser };
