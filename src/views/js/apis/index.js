import api from "./axios.js";
import { ORIGIN } from "../config.js";
import { userNameFormatter } from "../utils.js";

export let userProfile = {};

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
    const greetingMsgElem = document.getElementById("greeting-msg");

    function showGreetingMsg(fullName) {
        const firstName = userNameFormatter(fullName?.split(" ")?.[0]);

        greetingMsgElem.textContent = `Welcome back, ${firstName}! Here's what's happening today.`;
    }

    try {
        const res = await api.get("/auth/me");
        const data = res.data?.data;

        if (!data) return;
        if (greetingMsgElem) showGreetingMsg(data?.fullName);

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

        console.error(error);
    }
}

async function logout() {
    try {
        const res = await api.post("/auth/logout");

        if (res.status === 200) {
            location.replace("/");
        }
    } catch (error) {
        console.error(error.response);
    }
}
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => logout());

fetchUserProfile();
