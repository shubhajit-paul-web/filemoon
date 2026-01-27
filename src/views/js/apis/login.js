import api from "./axios.js";
import { ORIGIN } from "../config.js";

function initializeLoginForm() {
    var notyf = new Notyf();

    const form = document.querySelector("form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const { email, password } = e.target;

        try {
            const res = await api.post("/auth/login", {
                email: email?.value,
                password: password?.value,
            });

            if (res.status === 200) {
                window.location.href = `${ORIGIN}/app/dashboard.html`;
            }
        } catch (error) {
            const res = error.response.data;

            const errorMsgMap = {
                VALIDATION_ERROR: "Invalid email ID!",
                USER_NOT_FOUND: "User not found!",
                INCORRECT_PASSWORD: "Incorrect password",
            };

            notyf.error(errorMsgMap[res.errorCode] ?? res.message);
        }
    });
}

api.get("/auth/me")
    .then((res) => {
        if (res.status === 200) {
            window.location.href = `${ORIGIN}/app/dashboard.html`;
        }
    })
    .catch(() => initializeLoginForm());
