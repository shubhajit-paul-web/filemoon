import { Schema, model } from "mongoose";

const shareSchema = new Schema(
    {
        from: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        to: {
            type: String,
            lowercase: true,
            trim: true,
            required: true,
        },
        file: {
            type: Schema.Types.ObjectId,
            ref: "File",
            required: true,
        },
        expiry: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "expired"],
            default: "active",
        },
    },
    { timestamps: true }
);

const Share = model("Share", shareSchema);
export default Share;
