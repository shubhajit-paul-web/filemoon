import { Router } from "express";
import authUser from "../../middlewares/auth.middleware.js";
import dashboardController from "../../controllers/dashboard.controller.js";

const router = Router();

// (Private) GET /api/v1/dashboard/metrics
router.get("/metrics", authUser, dashboardController.getMetrics);

export default router;
