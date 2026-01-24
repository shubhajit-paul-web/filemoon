import asyncHandler from "../utils/AsyncHandler.js";
import authService from "../services/auth.service.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/ApiResponse.js";
import {
    ACCESS_TOKEN_COOKIE_EXP,
    REFRESH_TOKEN_COOKIE_EXP,
    setCookieOptions,
} from "../utils/constants.js";

const registerUser = asyncHandler(async (req, res) => {
    const { registeredUser, accessToken, refreshToken } = await authService.registerUser({
        ...(req.body || {}),
        profilePicture: req.file,
    });

    res.cookie("accessToken", accessToken, setCookieOptions(ACCESS_TOKEN_COOKIE_EXP));
    res.cookie("refreshToken", refreshToken, setCookieOptions(REFRESH_TOKEN_COOKIE_EXP));

    return res
        .status(StatusCodes.CREATED)
        .json(ApiResponse.created("Signup successfully", registeredUser));
});

const loginUser = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.loginUser(req.body ?? {});

    res.cookie("accessToken", accessToken, setCookieOptions(ACCESS_TOKEN_COOKIE_EXP));
    res.cookie("refreshToken", refreshToken, setCookieOptions(REFRESH_TOKEN_COOKIE_EXP));

    return res.status(StatusCodes.OK).json(ApiResponse.success("Logged-in successfully", user));
});

const logoutUser = asyncHandler(async (req, res) => {
    await authService.logoutUser(req.user?.id);

    res.clearCookie("accessToken", { httpOnly: true });
    res.clearCookie("refreshToken", { httpOnly: true });

    return res.status(StatusCodes.OK).json(ApiResponse.noContent("Logout successfully"));
});

export default { registerUser, loginUser, logoutUser };
