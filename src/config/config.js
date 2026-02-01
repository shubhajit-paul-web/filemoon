import DotenvFlow from "dotenv-flow";

DotenvFlow.config({
    default_node_env: "dev",
});

export default Object.freeze({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 8080,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017",
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    JWT: {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION || "1h",
        REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION || "60d",
    },
    SMTP: {
        EMAIL: process.env.SMTP_EMAIL,
        PASS: process.env.SMTP_PASS,
    },
});
