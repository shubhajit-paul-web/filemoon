import { Schema, model } from "mongoose";
import removeWhiteSpaces from "../utils/removeWhiteSpaces.js";

const fileInfoSchema = new Schema(
    {
        url: {
            type: String,
            required: true,
        },
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
            required: true,
        },
        description: {
            type: String,
            trim: true,
            maxLength: 500,
        },
        file: {
            type: fileInfoSchema,
            immutable: true,
            required: true,
        },
        type: {
            type: String,
            lowercase: true,
            immutable: true,
            required: true,
        },
        size: {
            type: Number,
            immutable: true,
            required: true,
        },
        category: {
            type: String,
            lowercase: true,
            immutable: true,
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            immutable: true,
            required: true,
        },
    },
    { timestamps: true }
);

fileSchema.index({ fileName: "text" });

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
