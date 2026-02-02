import { Router } from "express";
import authUser from "../../middlewares/auth.middleware.js";
import validators from "../../validators/share.validator.js";
import shareController from "../../controllers/share.controller.js";

const router = Router();

// (Private) POST /api/v1/shares
router.post("/", authUser, validators.createShareValidator, shareController.shareFile);

export default router;
