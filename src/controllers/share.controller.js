import asyncHandler from "../utils/AsyncHandler.js";
import shareService from "../services/share.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { StatusCodes } from "http-status-codes";

const shareFile = asyncHandler(async (req, res) => {
    const createdShare = await shareService.shareFile(req.user, req.body);

    return res
        .status(StatusCodes.CREATED)
        .json(ApiResponse.created("File shared successfully", createdShare));
});

const fetchShares = asyncHandler(async (req, res) => {
    const { shares, pagination } = await shareService.fetchShares(req.user.id, req.query);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("File Shares history fetched successfully", shares, pagination));
});

export default { shareFile, fetchShares };
