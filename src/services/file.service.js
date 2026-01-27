import File from "../models/file.model.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import errorCodes from "../utils/errorCodes.js";
import storageService from "./storage.service.js";
import removeFileExtension from "../utils/removeFileExtension.js";
import axios from "axios";

const createFile = async (userId, payload) => {
    const { file, fileName, description } = payload;

    if (!file?.buffer) {
        throw new ApiError(StatusCodes.NOT_FOUND, "File is required", errorCodes.VALIDATION_ERROR);
    }

    let fileCategory = file.mimetype?.split("/")?.[0] ?? "bin";

    if (["application", "text"].includes(fileCategory)) {
        fileCategory = "document";
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
        category: fileCategory,
        createdBy: userId,
    });

    return createdFile;
};

const updateFileInfo = async (file, payload) => {
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

const deleteFile = async (file) => {
    const deletedFile = await File.findByIdAndDelete(file?._id);

    if (deleteFile) {
        storageService.deleteFile(deletedFile?.file?.fileId);
    }

    return deletedFile;
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

const downloadFile = async (fileObj) => {
    const { file, fileName, type: contentType } = fileObj;

    // extracting the file extension
    const extension = contentType?.split("/")?.[1] || "bin";

    // Sending request to ImageKit server and stream the response
    const response = await axios.get(file?.url, { responseType: "stream" });

    return { response, extension, fileName, contentType };
};

export default { createFile, updateFileInfo, deleteFile, fetchFiles, downloadFile };
