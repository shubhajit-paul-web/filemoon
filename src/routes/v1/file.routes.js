import { Router } from "express";
import authUser from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";
import validators from "../../validators/file.validator.js";
import fileController from "../../controllers/file.controller.js";
import checkResourceAccess from "../../middlewares/checkResourceAccess.middleware.js";

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
    checkResourceAccess,
    fileController.updateFileInfo
);

// (Private) DELETE /api/v1/files/:id
router.delete(
    "/:id",
    authUser,
    validators.fileIdValidator,
    checkResourceAccess,
    fileController.deleteFile
);

// (Private) GET /api/v1/files/:id
router.get(
    "/:id",
    authUser,
    validators.fileIdValidator,
    checkResourceAccess,
    fileController.fetchFileById
);

// (Private) GET /api/v1/files
router.get("/", authUser, validators.paginationValidator, fileController.fetchFiles);

// (Private) GET /api/v1/files/:id/download
router.get(
    "/:id/download",
    authUser,
    validators.fileIdValidator,
    checkResourceAccess,
    fileController.downloadFile
);

export default router;
