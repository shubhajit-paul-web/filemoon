import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.static("src/views"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Routes imports
import authRoutes from "./routes/v1/auth.routes.js";
import userRoutes from "./routes/v1/user.routes.js";
import fileRoutes from "./routes/v1/file.routes.js";
import dashboardRoutes from "./routes/v1/dashboard.routes.js";

// Routes declarations
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Global error handler
app.use(errorHandler);

export default app;
