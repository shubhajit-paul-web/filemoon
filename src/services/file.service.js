import File from "../models/file.model.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import errorCodes from "../utils/errorCodes.js";
import storageService from "./storage.service.js";

const createFile = async (userId, payload) => {
    const { file, fileName, description } = payload;

    if (!file?.buffer) {
        throw new ApiError(StatusCodes.NOT_FOUND, "File is required", errorCodes.VALIDATION_ERROR);
    }

    const uploadedFile = await storageService.uploadFile(file);

    const createdFile = await File.create({
        fileName: fileName || file?.originalname,
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

export default { createFile };
