import mongoose from "mongoose";
import config from "../config/config.js";
import logger from "../loggers/winston.logger.js";

async function connectDB() {
    try {
        const conn = await mongoose.connect(`${config.MONGODB_URI}/filemoon`);

        logger.info("MongoDB is connected", { host: conn.connection.host });
    } catch (error) {
        logger.error(`MongoDB connection faild`, {
            event: "mongodb_connection_faild",
            reason: error.message,
        });
        process.exit(1);
    }
}

export default connectDB;
