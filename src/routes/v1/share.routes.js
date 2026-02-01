import { Router } from "express";
import authUser from "../../middlewares/auth.middleware.js";
import shareController from "../../controllers/share.controller.js";

const router = Router();

// (Private) POST /api/v1/shares
router.post("/", authUser, shareController.shareFile);

export default router;
