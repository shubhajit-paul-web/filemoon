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
    const updatedFile = await fileService.updateFileInfo(req.file, req.body);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("File info updated successfully", updatedFile));
});

const deleteFile = asyncHandler(async (req, res) => {
    const deletedFile = await fileService.deleteFile(req.file);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("File deleted successfully", deletedFile));
});

const fetchFileById = asyncHandler(async (req, res) => {
    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("File fetched successfully", req.file));
});

const fetchFiles = asyncHandler(async (req, res) => {
    const { files, pagination } = await fileService.fetchFiles(req.user?.id, req.query);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Files fetched successfully", files, pagination));
});

export default { createFile, updateFileInfo, deleteFile, fetchFileById, fetchFiles };
