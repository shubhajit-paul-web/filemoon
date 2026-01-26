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

const updateFileInfo = asyncHandler(async (req, res) => {
    const updatedFile = await fileService.updateFileInfo(req.user?.id, req.params?.id, req.body);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("File info updated successfully", updatedFile));
});

const fetchFileById = asyncHandler(async (req, res) => {
    const file = await fileService.fetchFileById(req.user?.id, req.params?.id);

    return res.status(StatusCodes.OK).json(ApiResponse.success("File fetched successfully", file));
});

const fetchFiles = asyncHandler(async (req, res) => {
    const { files, pagination } = await fileService.fetchFiles(req.user?.id, req.query);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Files fetched successfully", files, pagination));
});

export default { createFile, updateFileInfo, fetchFileById, fetchFiles };
