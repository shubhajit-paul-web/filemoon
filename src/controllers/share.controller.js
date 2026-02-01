import asyncHandler from "../utils/AsyncHandler.js";
import shareService from "../services/share.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { StatusCodes } from "http-status-codes";

const shareFile = asyncHandler(async (req, res) => {
    await shareService.shareFile(req.body);

    return res.status(StatusCodes.OK).json(ApiResponse.success("File shared successfully"));
});

export default { shareFile };
