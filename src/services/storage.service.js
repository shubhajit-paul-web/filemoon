import ImageKit, { toFile } from "@imagekit/nodejs";
import config from "../config/config.js";
import { v4 as uuid } from "uuid";
import logger from "../loggers/winston.logger.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import errorCodes from "../utils/errorCodes.js";

const client = new ImageKit({
	privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

const uploadProfilePicture = async ({ file, fileName, folder = "profiles" }) => {
	try {
		const uploadedFile = await client.files.upload({
			file: await toFile(Buffer.from(file?.buffer), "file"),
			fileName: fileName || uuid(),
			folder: "filemoon/" + folder,
		});

		return uploadedFile;
	} catch (error) {
		logger.error("Faild to upload a file", {
			event: "imagekit_file_uploading_faild",
			reason: error.message,
		});

		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Faild to upload a file", errorCodes.FILE_UPLOADING_FAILD, false);
	}
};

const deleteFile = async (fileId) => {
	try {
		return await client.files.delete(fileId);
	} catch (error) {
		logger.error("Faild to delete a file", {
			event: "imagekit_file_deleting_faild",
			reason: error.message,
		});

		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Faild to delete a file", errorCodes.FILE_DELETING_FAILD, false);
	}
};

export default { uploadProfilePicture, deleteFile };
