import { body } from "express-validator";
import respondWithValidationErrors from "../middlewares/validator.middleware.js";

const createFileValidator = [
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

export default { createFileValidator };
