import { StatusCodes } from "http-status-codes";

// Global error handler
const errorHandler = async (error, req, res, next) => {
	const statusCode = error?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;

	return res.status(statusCode).json({
		success: false,
		statusCode: statusCode,
		message: error?.message ?? "Internal server error",
		errorCode: error?.errorCode ?? "INTERNAL_SERVER_ERROR",
		isOperational: Boolean(error?.isOperational),
	});
};

export default errorHandler;
