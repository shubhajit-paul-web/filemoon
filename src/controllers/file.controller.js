import asyncHandler from "../utils/AsyncHandler.js";
import fileService from "../services/file.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { StatusCodes } from "http-status-codes";

const createFile = asyncHandler(async (req, res) => {
    const uploadedFile = await fileService.createFile(req.user?.id, {
        ...req.body,
        file: req.file,
    });

    return res
        .status(StatusCodes.CREATED)
        .json(ApiResponse.created("File created successfully", uploadedFile));
});

export default { createFile };
