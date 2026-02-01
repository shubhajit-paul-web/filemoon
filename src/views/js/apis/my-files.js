import api from "./axios.js";
import formatFileSize from "../formatFileSize.js";
import { ORIGIN } from "../config.js";
import { closeDrawer } from "../my-files.js";
import { currentFileCategory } from "../my-files.js";

const notyf = new Notyf({
    position: { x: "center", y: "top" },
});

// Delete file
function deleteFile() {
    const deleteFileBtns = document.querySelectorAll(".delete-file-btn");

    deleteFileBtns.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const fileId = e.target.dataset?.fileId;

            if (fileId) {
                Swal.fire({
                    title: "Do you want to delete this file?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const res = await api.delete(`/files/${fileId}`);

                            if (res.status === 200) {
                                // remove the deleted file row from UI
                                document.getElementById(`file-${fileId}`)?.remove();

                                Swal.fire("File deleted successfully!", "", "success");
                            }
                        } catch (error) {
                            notyf.error(
                                error.response ? error.response?.data?.message : error.message
                            );
                        }
                    }
                });
            }
        });
    });
}

// Upload file
function uploadFile() {
    const uploadFileForm = document.getElementById("file-upload-form");
    const uploadFileBtn = document.getElementById("upload-file-btn");
    const progressPercent = document.getElementById("progress-percent");
    const uploadProgress = document.getElementById("upload-progress");
    const uploadProgressBar = document.getElementById("progress-bar");

    uploadFileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(uploadFileForm);
        const file = formData.get("file");

        // Validating file size
        const MAXIMUM_FILE_SIZE = 100 * 1024 * 1024; // 100mb
        if (file.size > MAXIMUM_FILE_SIZE) {
            return notyf.error("File too large. Maximum allowed size is 100MB");
        }

        // Upload button UI before change
        const uploadFileBtnNormal = uploadFileBtn.innerHTML;

        // Add: Upload file button loading UI
        uploadFileBtn.setAttribute("disabled", true);
        uploadFileBtn.classList.add("opacity-60");
        uploadFileBtn.innerHTML = `
            <i class="ri-loader-fill animate-spin"></i>
            <span>Uploading file...</span>
        `;

        // Show progress bar
        uploadProgress.classList.remove("hidden");
        progressPercent.textContent = "0%";

        try {
            const options = {
                onUploadProgress: (progressEvent) => {
                    const loaded = progressEvent.loaded;
                    const total = progressEvent.total;
                    const percentage = Math.floor((loaded / total) * 100);

                    progressPercent.textContent = `${percentage}%`;
                    uploadProgressBar.style.width = `${percentage}%`;
                },
            };

            const res = await api.post("/files", formData, options);

            if (res.status === 201) {
                fetchFiles(currentFileCategory);
                closeDrawer();
                uploadFileForm.reset();

                notyf.success("File uploaded successfully");
            }
        } catch (error) {
            notyf.error(error?.response?.data?.message);
        } finally {
            // Remove: Upload file button loading UI
            uploadFileBtn.removeAttribute("disabled");
            uploadFileBtn.innerHTML = uploadFileBtnNormal;
            uploadFileBtn.classList.remove("opacity-60");

            // Hide progress
            uploadProgress.classList.add("hidden");
            uploadProgressBar.style.width = "0px";
        }
    });
}

// Fetch files based on category
export async function fetchFiles(category, query = "") {
    const myFilesTable = document.getElementById("my-files-table");
    let endpoint = "/files";

    try {
        // Filters
        if (category) {
            endpoint += `?category=${category}`;
        }
        if (query) {
            endpoint += category ? `&q=${query}` : `?q=${query}`;
        }

        const response = await api.get(endpoint);

        if (response.status !== 200) return;

        const files = response.data?.data;
        let myFilesTableHTML = "";

        const categoryColorsMap = {
            image: "bg-orange-100 text-orange-800",
            video: "bg-blue-100 text-blue-600",
            document: "bg-pink-100 text-pink-600",
            audio: "bg-purple-100 text-purple-600",
        };

        const iconsMap = {
            image: "ri-image-line",
            video: "ri-video-line",
            document: "ri-file-pdf-line",
            audio: "ri-folder-music-line",
        };

        if (!files.length) {
            myFilesTable.innerHTML = `
                <tr>
                    <td colspan="5" class="py-5 text-lg text-center text-zinc-600">No files found!</td>
                </tr>
            `;
            return;
        }

        // Add rows into files table
        files.forEach((file) => {
            myFilesTableHTML += `
                <tr class="group hover:bg-indigo-50/30 transition-colors" id="file-${file?._id}">
                    <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg ${categoryColorsMap[file?.category]} flex items-center justify-center text-xl">
                                <i class="${iconsMap[file?.category]}"></i>
                            </div>
                            <div class="max-w-md">
                                <a href="${file?.file?.url}" title="${file?.fileName}" target="_blank" class="font-medium text-zinc-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                    ${file?.fileName}
                                </a>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-default ${categoryColorsMap[file?.category]}">
                            ${file?.category}
                        </span>
                    </td>
                    <td class="py-4 px-6 text-zinc-500">${formatFileSize(file?.size)}</td>
                    <td class="py-4 px-6 text-zinc-500">${moment(file?.createdAt).format("Do MMM YYYY, hh:mm a")}</td>
                    <td class="py-4 px-6">
                        <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a href="${file?.file?.url}" target="_blank" class="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer" title="View">
                                <i class="ri-eye-line"></i>
                            </a>
                            <button 
                                class="edit-file-btn p-2 text-zinc-400 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer" 
                                title="Edit"
                                data-file-id="${file?._id}"
                                data-file-name="${file?.fileName}"
                                data-file-description="${file?.description || ""}"
                            >
                                <i class="ri-edit-line"></i>
                            </button>
                            <a href="${ORIGIN}/api/v1/files/${file?._id}/download" class="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" title="Download">
                                <i class="ri-download-line pointer-events-none"></i>
                            </a>
                            <button class="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer delete-file-btn" title="Delete" data-file-id="${file?._id}" data-file-name="${file?.fileName}">
                                <i class="ri-delete-bin-line pointer-events-none"></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        });

        myFilesTable.innerHTML = myFilesTableHTML;
        deleteFile();
    } catch (error) {
        notyf.error(error.response ? error.response.data?.message : "Something went wrong!");
        console.error(error);
    }
}

window.onload = () => {
    fetchFiles();
    uploadFile();
};

// Filter files by category buttons
const categoryAllFilesBtn = document.getElementById("category-all-files-btn");
const categoryVideoFilesBtn = document.getElementById("category-video-files-btn");
const categoryDocumentFilesBtn = document.getElementById("category-document-files-btn");
const categoryImageFilesBtn = document.getElementById("category-image-files-btn");
const categoryAudioFilesBtn = document.getElementById("category-audio-files-btn");

// Fetch files by category
categoryAllFilesBtn.addEventListener("click", () => fetchFiles());
categoryVideoFilesBtn.addEventListener("click", () => fetchFiles("video"));
categoryDocumentFilesBtn.addEventListener("click", () => fetchFiles("document"));
categoryImageFilesBtn.addEventListener("click", () => fetchFiles("image"));
categoryAudioFilesBtn.addEventListener("click", () => fetchFiles("audio"));

// Search file
import { debounce } from "../utils.js";
const searchBar = document.getElementById("files-search-bar");

const searchFiles = debounce(fetchFiles, 400);

searchBar.addEventListener("keyup", (e) => {
    const query = e.target.value?.trim();

    if (!query) {
        return searchFiles(currentFileCategory);
    }

    searchFiles(currentFileCategory, query);
});
