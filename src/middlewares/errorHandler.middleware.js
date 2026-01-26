import { StatusCodes } from "http-status-codes";

// Global error handler
const errorHandler = async (error, req, res, next) => {
    const statusCode = error?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
    const isOperational = Boolean(error?.isOperational);
    const message = isOperational ? error?.message : "Internal server error";

    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message,
        errorCode: error?.errorCode ?? "INTERNAL_SERVER_ERROR",
        isOperational,
    });
};

export default errorHandler;
