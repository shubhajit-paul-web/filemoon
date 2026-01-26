import { body, param, query } from "express-validator";
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

const paginationValidator = [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be an integer between 1 and 100"),
    query("sortBy")
        .optional()
        .isIn(["createdAt", "updatedAt", "fileName", "size", "type"])
        .withMessage(
            "Invalid sort field. Allowed values: createdAt, updatedAt, fileName, size, type"
        ),
    query("sortType")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Sort type must be either 'asc' or 'desc'"),

    respondWithValidationErrors,
];

export default { fileInfoValidator, fileIdValidator, paginationValidator };
