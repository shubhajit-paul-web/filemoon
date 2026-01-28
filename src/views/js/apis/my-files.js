import api from "./axios.js";
import formatFileSize from "../formatFileSize.js";
import { ORIGIN } from "../config.js";

const notyf = new Notyf();

function deleteFile() {
    const deleteFileBtns = document.querySelectorAll(".delete-file-btn");

    deleteFileBtns.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const fileId = e.target.dataset?.fileId;
            const fileName = e.target.dataset?.fileName;

            if (fileId) {
                const ans = confirm(`Do you want to delete ${fileName} file?`);

                if (ans) {
                    try {
                        const res = await api.delete(`/files/${fileId}`);

                        if (res.status === 200) {
                            notyf.success(`${fileName} deleted successfully`);

                            const deletedFileRow = document.getElementById(`file-${fileId}`);

                            deletedFileRow?.remove();
                        }
                    } catch (error) {
                        notyf.error(error.response?.data?.message);
                    }
                }
            }
        });
    });
}

const myFilesTable = document.getElementById("my-files-table");

export async function fetchFiles(category) {
    try {
        const response = await api.get(category ? `/files?category=${category}` : "/files");

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

        files?.forEach((file) => {
            myFilesTableHTML += `
                <tr class="group hover:bg-indigo-50/30 transition-colors" id="file-${file?._id}">
                    <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg ${categoryColorsMap[file?.category]} flex items-center justify-center text-xl">
                                <i class="${iconsMap[file?.category]}"></i>
                            </div>
                            <div>
                                <a href="${file?.file?.url}" target="_blank" class="font-medium text-zinc-800 group-hover:text-indigo-600 transition-colors">
                                    ${file?.fileName}
                                </a>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColorsMap[file?.category]}">
                            ${file?.category}
                        </span>
                    </td>
                    <td class="py-4 px-6 text-zinc-500">${formatFileSize(file?.size)}</td>
                    <td class="py-4 px-6 text-zinc-500">${moment(file?.createdAt).format("MMMM Do YYYY, h:mm a")}</td>
                    <td class="py-4 px-6">
                        <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                class="edit-file-btn p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer" 
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
                            <button class="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors delete-file-btn" title="Delete" data-file-id="${file?._id}" data-file-name="${file?.fileName}">
                                <i class="ri-delete-bin-line pointer-events-none"></i>
                            </button>
                            <button class="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors" title="More">
                                <i class="ri-more-2-fill"></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        });

        if (myFilesTableHTML) {
            myFilesTable.innerHTML = myFilesTableHTML;
        }

        deleteFile();
    } catch (error) {
        console.error(error);
    }
}

fetchFiles();

// Filter files by category buttons
const categoryAllFilesBtn = document.getElementById("category-all-files-btn");
const categoryVideoFilesBtn = document.getElementById("category-video-files-btn");
const categoryDocumentFilesBtn = document.getElementById("category-document-files-btn");
const categoryImageFilesBtn = document.getElementById("category-image-files-btn");

// Fetch files by category
categoryAllFilesBtn.addEventListener("click", () => fetchFiles());
categoryVideoFilesBtn.addEventListener("click", () => fetchFiles("video"));
categoryDocumentFilesBtn.addEventListener("click", () => fetchFiles("document"));
categoryImageFilesBtn.addEventListener("click", () => fetchFiles("image"));
