import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import config from "./src/config/config.js";
import logger from "./src/loggers/winston.logger.js";

// Connect to DB and start the server
(async () => {
    try {
        await connectDB();

        app.listen(config.PORT, () => {
            logger.info(`Server is running on port ${config.PORT}`);
        });
    } catch (error) {
        logger.error("Server startup failed", {
            event: "server_startup_faild",
            reason: error.message,
            PORT: config.PORT,
        });
        process.exit(1);
    }
})();
