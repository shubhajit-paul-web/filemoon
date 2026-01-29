import api from "./axios.js";
import { ORIGIN } from "../config.js";

async function fetchUserProfile(callback) {
    try {
        const res = await api.get("/auth/me");

        if (res.status === 200) {
            location.replace(`${ORIGIN}/dashboard`);
        }
    } catch {
        try {
            const res = await api.get("/auth/refresh-access-token");

            if (res.status === 200) return location.reload();
        } catch {
            callback();
        }
    }
}

export default fetchUserProfile;
