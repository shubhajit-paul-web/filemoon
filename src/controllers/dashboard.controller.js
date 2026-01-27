import asyncHandler from "../utils/AsyncHandler.js";
import dashboardService from "../services/dashboard.service.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/ApiResponse.js";

const getMetrics = asyncHandler(async (req, res) => {
    const metrics = await dashboardService.getMetrics(req.user?.id);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Dashboard Metrics fetched successfully", metrics));
});

export default { getMetrics };
