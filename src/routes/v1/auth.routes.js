import { Router } from "express";
import upload from "../../middlewares/upload.middleware.js";
import authController from "../../controllers/auth.controller.js";

const router = Router();

// (Public) POST /api/v1/auth/register
router.post("/register", upload.single("profilePicture"), authController.registerUser);

export default router;
