import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import path from "path";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.static("src/views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

function getFilePath(fileName) {
    return path.join(process.cwd(), "src", "views", fileName);
}

// UI Endpoints
app.get("/signup", async (req, res) => {
    return res.sendFile(getFilePath("signup.html"));
});

app.get("/app/dashboard", async (req, res) => {
    return res.sendFile(getFilePath("app/dashboard.html"));
});

app.get("/app/my-files", async (req, res) => {
    return res.sendFile(getFilePath("app/my-files.html"));
});

app.get("/app/history", async (req, res) => {
    return res.sendFile(getFilePath("app/history.html"));
});

// Routes imports
import authRoutes from "./routes/v1/auth.routes.js";
import userRoutes from "./routes/v1/user.routes.js";
import fileRoutes from "./routes/v1/file.routes.js";
import dashboardRoutes from "./routes/v1/dashboard.routes.js";

// Routes declarations (API Endpoints)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// 404 handler
app.use(notFoundMiddleware);

// Global error handler
app.use(errorHandler);

export default app;
