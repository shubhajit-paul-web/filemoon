import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.static("src/views"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
