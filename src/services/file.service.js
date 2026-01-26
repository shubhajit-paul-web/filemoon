import File from "../models/file.model.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import errorCodes from "../utils/errorCodes.js";
import storageService from "./storage.service.js";
import removeFileExtension from "../utils/removeFileExtension.js";

const createFile = async (userId, payload) => {
    const { file, fileName, description } = payload;

    if (!file?.buffer) {
        throw new ApiError(StatusCodes.NOT_FOUND, "File is required", errorCodes.VALIDATION_ERROR);
    }

    const uploadedFile = await storageService.uploadFile(file);

    const createdFile = await File.create({
        fileName: fileName || removeFileExtension(file?.originalname),
        description,
        file: {
            url: uploadedFile?.url,
            fileId: uploadedFile?.fileId,
        },
        type: file?.mimetype,
        size: uploadedFile?.size,
        createdBy: userId,
    });

    return createdFile;
};

const updateFileInfo = async (userId, fileId, payload) => {
    const file = await File.findById(fileId);

    if (!file) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "The file you're trying to update does not exist or has been deleted",
            errorCodes.NOT_FOUND
        );
    }

    const hasAccess = file?.createdBy?.toString() === userId;

    if (!hasAccess) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "You don't have permission to modify this file",
            errorCodes.UNAUTHORIZED
        );
    }

    const { fileName, description } = payload ?? {};

    if (!fileName && !description) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Please provide at least one field to update (fileName or description)",
            errorCodes.VALIDATION_ERROR
        );
    }

    if (fileName) file.fileName = fileName;
    if (description) file.description = description;

    return await file.save();
};

const fetchFileById = async (userId, fileId) => {
    const file = await File.findById(fileId).lean();

    if (!file) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "The file you're trying to update does not exist or has been deleted",
            errorCodes.NOT_FOUND
        );
    }

    const hasAccess = file?.createdBy?.toString() === userId;

    if (!hasAccess) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "You don't have permission to modify this file",
            errorCodes.UNAUTHORIZED
        );
    }

    return file;
};

const fetchFiles = async (userId, params) => {
    let { q, page, limit, sortBy = "createdAt", sortType = "desc" } = params ?? {};

    q = q?.trim();
    page = parseInt(page || 1);
    limit = parseInt(limit || 10);

    const skip = (page - 1) * limit;

    const filter = { createdBy: userId };

    if (q) {
        filter["$text"] = { $search: q };
    }

    const [totalFiles, files] = await Promise.all([
        File.countDocuments(filter),
        File.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({
                [sortBy]: sortType === "desc" ? -1 : 1,
            })
            .lean(),
    ]);

    const totalPages = Math.ceil(totalFiles / limit);

    const pagination = {
        page,
        limit,
        totalFiles,
        filesOnPage: files.length,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
    };

    return { files, pagination };
};

export default { createFile, updateFileInfo, fetchFileById, fetchFiles };
