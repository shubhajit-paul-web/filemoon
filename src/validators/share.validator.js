import { body } from "express-validator";
import { isValidObjectId } from "mongoose";
import respondWithValidationErrors from "../middlewares/validator.middleware.js";

const createShareValidator = [
    body("fileId").custom(isValidObjectId).withMessage("Invalid file id"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .toLowerCase(),
    body("expiry")
        .notEmpty()
        .withMessage("Expiry is required")
        .isISO8601({ strict: true })
        .withMessage("Invalid datetime format"),

    respondWithValidationErrors,
];

export default { createShareValidator };
