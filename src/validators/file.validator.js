import { body, param } from "express-validator";
import respondWithValidationErrors from "../middlewares/validator.middleware.js";
import { isValidObjectId } from "mongoose";

const fileInfoValidator = [
    body("fileName")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Maximum 100 characters allowed"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Maximum 500 characters allowed"),

    respondWithValidationErrors,
];

const fileIdValidator = [
    param("id").custom(isValidObjectId).withMessage("Invalid file id"),

    respondWithValidationErrors,
];

export default { fileInfoValidator, fileIdValidator };
