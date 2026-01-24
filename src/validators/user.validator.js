import { body } from "express-validator";
import removeWhiteSpaces from "../utils/removeWhiteSpaces.js";
import respondWithValidationErrors from "../middlewares/validator.middleware.js";

const updateUserValidator = [
    body("fullName")
        .optional()
        .customSanitizer(removeWhiteSpaces)
        .isLength({ min: 3, max: 50 })
        .withMessage("Full name must be between 3 and 50 characters"),

    body("phoneNumber")
        .optional()
        .trim()
        .isMobilePhone("en-IN")
        .withMessage("Invalid phone number"),

    respondWithValidationErrors,
];

export default { updateUserValidator };
