import { Schema, model } from "mongoose";
import removeWhiteSpaces from "../utils/removeWhiteSpaces.js";

const fileInfoSchema = new Schema(
    {
        url: {
            type: String,
            required: true,
        },
        thumbnailUrl: String,
        fileId: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const fileSchema = new Schema(
    {
        fileName: {
            type: String,
            trim: true,
            maxLength: 100,
            index: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            maxLength: 500,
        },
        file: {
            type: fileInfoSchema,
            required: true,
        },
        type: {
            type: String,
            lowercase: true,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

fileSchema.pre("save", async function () {
    if (!this.isModified("fileName")) return;

    this.fileName = removeWhiteSpaces(this.fileName?.toString());
});

fileSchema.pre("save", async function () {
    if (!this.isModified("description")) return;

    this.description = removeWhiteSpaces(this.description);
});

const File = model("File", fileSchema);
export default File;
