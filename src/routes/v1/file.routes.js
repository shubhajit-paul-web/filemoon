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
    validators.fileInfoValidator,
    fileController.createFile
);

// (Private) PATCH /api/v1/files/:id
router.patch(
    "/:id",
    authUser,
    validators.fileIdValidator,
    validators.fileInfoValidator,
    fileController.updateFileInfo
);

// (Private) GET /api/v1/files/:id
router.get("/:id", authUser, validators.fileIdValidator, fileController.fetchFileById);

// (Private) GET /api/v1/files
router.get("/", authUser, fileController.fetchFiles);

export default router;
