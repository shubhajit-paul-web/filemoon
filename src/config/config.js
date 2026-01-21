import DotenvFlow from "dotenv-flow";

DotenvFlow.config({
	default_node_env: "dev",
});

export default Object.freeze({
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT || 8080,
	MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017",
	JWT: {
		ACCESS_SECRET: process.env.ACCESS_SECRET,
		REFRESH_SECRET: process.env.REFRESH_SECRET,
	},
});
