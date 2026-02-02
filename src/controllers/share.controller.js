import asyncHandler from "../utils/AsyncHandler.js";
import shareService from "../services/share.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { StatusCodes } from "http-status-codes";

const shareFile = asyncHandler(async (req, res) => {
    const createdShare = await shareService.shareFile(req.user?.id, req.body);

    return res
        .status(StatusCodes.CREATED)
        .json(ApiResponse.created("File shared successfully", createdShare));
});

export default { shareFile };
