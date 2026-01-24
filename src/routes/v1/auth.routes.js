import { Router } from "express";
import upload from "../../middlewares/upload.middleware.js";
import authController from "../../controllers/auth.controller.js";
import validators from "../../validators/auth.validator.js";
import authUser from "../../middlewares/auth.middleware.js";

const router = Router();

// (Public) POST /api/v1/auth/register
router.post(
    "/register",
    upload.single("profilePicture"),
    validators.registerUserValidator,
    authController.registerUser
);

// (Public) POST /api/v1/auth/login
router.post("/login", validators.loginUserValidator, authController.loginUser);

// (Private) POST /api/v1/auth/logout
router.post("/logout", authUser, authController.logoutUser);

export default router;
