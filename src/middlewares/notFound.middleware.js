import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import errorCodes from "../utils/errorCodes.js";

// 404 handler
const notFoundMiddleware = async (req, res, next) => {
    return next(
        new ApiError(StatusCodes.NOT_FOUND, `${req.originalUrl} not found`, errorCodes.NOT_FOUND)
    );
};

export default notFoundMiddleware;
