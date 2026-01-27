import api from "./axios.js";
import { ORIGIN } from "../config.js";
import { userNameFormatter } from "../utils.js";

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

        if (res?.statusCode) {
            location.replace(ORIGIN);
        }

        console.error(error);
    }
}

fetchUserProfile();
