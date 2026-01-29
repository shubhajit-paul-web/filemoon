import api from "./axios.js";
import { ORIGIN } from "../config.js";
import fetchUserProfile from "../apis/fetchUserProfile.js";

function initializeSignupForm() {
    var notyf = new Notyf();

    const signupForm = document.querySelector("#signup-form");
    const submitBtn = document.querySelector(".signup-form-submit-btn");

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        submitBtn.setAttribute("disabled", true);
        submitBtn.textContent = "Loading...";

        // remove all the previous error messages and red color input filed borders
        document.querySelectorAll(".error-msg")?.forEach((elem) => elem?.remove());
        document.querySelectorAll("input")?.forEach((elem) => elem?.removeAttribute("style"));

        try {
            const response = await api.post("/auth/register", formData);

            if (response.status === 201) {
                location.replace(`${ORIGIN}/dashboard`);
            }
        } catch (error) {
            const res = error.response?.data;

            if (res.statusCode === 400) {
                const validationErrors = res.errors;

                validationErrors?.forEach((err) => {
                    const errMsgElm = document.createElement("p");
                    errMsgElm.textContent = err.msg;
                    errMsgElm.className = "error-msg text-sm text-red-500";

                    const fieldWrapper = form[err.path]?.parentElement;

                    fieldWrapper?.after(errMsgElm);

                    form[err?.path].style.border = "2px solid red";
                });
            } else {
                notyf.error(error.response.data?.message);
            }
        } finally {
            submitBtn.removeAttribute("disabled");
            submitBtn.innerHTML = `
            <span>Create Account</span>
            <i class="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
        `;
        }
    });
}

fetchUserProfile(initializeSignupForm);
