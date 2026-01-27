import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import errorCodes from "../utils/errorCodes.js";

const respondWithValidationErrors = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    const formattedErrors = errors.array().map((field) => ({
        path: field.path,
        msg: field.msg,
    }));

    return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        errorCode: errorCodes.VALIDATION_ERROR,
        isOperational: true,
        message: "Validation faild",
        errors: formattedErrors,
    });
};

export default respondWithValidationErrors;
