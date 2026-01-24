import { Router } from "express";
import authUser from "../../middlewares/auth.middleware.js";
import validators from "../../validators/user.validator.js";
import userController from "../../controllers/user.controller.js";
import upload from "../../middlewares/upload.middleware.js";

const router = Router();

// (Private) PATCH /api/v1/users
router.patch(
    "/",
    authUser,
    upload.single("profilePicture"),
    validators.updateUserValidator,
    userController.updateUserProfile
);

export default router;
