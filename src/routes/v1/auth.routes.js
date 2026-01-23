import { Router } from "express";
import upload from "../../middlewares/upload.middleware.js";
import authController from "../../controllers/auth.controller.js";
import validators from "../../validators/auth.validator.js";

const router = Router();

// (Public) POST /api/v1/auth/register
router.post("/register", upload.single("profilePicture"), validators.registerUserValidator, authController.registerUser);

export default router;
