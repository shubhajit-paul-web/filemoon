import api from "./axios.js";
import { ORIGIN } from "../config.js";
import { userNameFormatter } from "../utils.js";

async function refreshAccessToken() {
    try {
        const response = await api.get("/auth/refresh-access-token");

        if (response.status === 200) {
            await fetchUserProfile();
            location.reload();
        }
    } catch {
        location.replace(ORIGIN);
    }
}

async function fetchUserProfile() {
    const defaultProfilePic = "https://api.dicebear.com/7.x/avataaars/svg?seed=male-595";

    try {
        const res = await api.get("/auth/me");

        const data = res.data?.data;

        if (!data) return;

        // Sidebar
        const profileImgElem = document.querySelector("#user-profile-img");
        const userFullNameElem = document.querySelector("#user-fullname");
        const userEmailElem = document.querySelector("#user-email");

        profileImgElem.setAttribute("src", data.profilePicture?.url ?? defaultProfilePic);
        userFullNameElem.textContent = userNameFormatter(data.fullName);
        userEmailElem.textContent = data.email;

        // Header
        const userAvatarHeader = document.querySelector("#user-avatar-header");

        userAvatarHeader.setAttribute("src", data?.profilePicture?.url ?? defaultProfilePic);
    } catch (error) {
        const res = error.response?.data;

        if (res?.errorCode === "ACCESS_TOKEN_NOT_FOUND") {
            await refreshAccessToken();
        }

        console.error(res);
    }
}

fetchUserProfile();
