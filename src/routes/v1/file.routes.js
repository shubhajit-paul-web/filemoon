import { Router } from "express";
import authUser from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";
import validators from "../../validators/file.validator.js";
import fileController from "../../controllers/file.controller.js";

const router = Router();

// (Private) POST /api/v1/files
router.post(
    "/",
    authUser,
    upload.single("file"),
    validators.createFileValidator,
    fileController.createFile
);

export default router;
