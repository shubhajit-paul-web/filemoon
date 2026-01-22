import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";

/* Global error handler */
const errorHandler = async (error, req, res, next) => {
	const statusCode = error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
	const errorMsg = error?.message || "Internal server error";
	const isOperational = Boolean(error?.isOperational);

	return res.status(statusCode).json(new ApiError(statusCode, errorMsg, error?.errorCode || "UNKNOWN", isOperational));
};

export default errorHandler;
