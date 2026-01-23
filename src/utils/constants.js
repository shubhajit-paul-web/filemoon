import config from "../config/config.js";

// Access and Refresh tokens cookies expiry
export const ACCESS_TOKEN_COOKIE_EXP = 1 * 60 * 60 * 1000; // 1h
export const REFRESH_TOKEN_COOKIE_EXP = 60 * 24 * 60 * 60 * 1000; // 60d

export function setCookieOptions(expiry) {
    return {
        httpOnly: true,
        secure: config.NODE_ENV === "prod",
        maxAge: expiry,
    };
}
