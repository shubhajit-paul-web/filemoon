import mongoose from "mongoose";
import File from "../models/file.model.js";

const getMetrics = async (userId) => {
    const metrics = await File.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $project: { _id: 0, category: 1 },
        },
        {
            $group: {
                _id: "$category",
                totalFiles: { $sum: 1 },
            },
        },
    ]);

    return metrics;
};

export default { getMetrics };
