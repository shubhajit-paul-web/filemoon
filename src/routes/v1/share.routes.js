import { Router } from "express";
import authUser from "../../middlewares/auth.middleware.js";
import validators from "../../validators/share.validator.js";
import shareController from "../../controllers/share.controller.js";

const router = Router();

router.use(authUser);

// (Private) POST /api/v1/shares
router.post("/", validators.createShareValidator, shareController.shareFile);

// (Private) GET /api/v1/shares
router.get("/", shareController.fetchShares);

// (Private) PATCH /api/v1/shares/:id/revoke-access
router.patch("/:id/revoke-access", validators.shareIdValidator, shareController.revokeAccess);

export default router;
