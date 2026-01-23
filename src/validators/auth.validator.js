import { body } from "express-validator";
import removeWhiteSpaces from "../utils/removeWhiteSpaces.js";
import respondWithValidationErrors from "../middlewares/validator.middleware.js";

const registerUserValidator = [
    body("fullName")
        .customSanitizer(removeWhiteSpaces)
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Full name must be between 3 and 50 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .toLowerCase(),

    body("phoneNumber")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .isMobilePhone("en-IN")
        .withMessage("Invalid phone number"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage(
            "Password must be at least 8 chars (1 uppercase, 1 lowercase, 1 number, 1 symbol)"
        ),

    respondWithValidationErrors,
];

const loginUserValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .toLowerCase(),
    body("password").trim().notEmpty().withMessage("Password is required"),

    respondWithValidationErrors,
];

export default { registerUserValidator, loginUserValidator };
