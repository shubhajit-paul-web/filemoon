import api from "./axios.js";
import formatFileSize from "../formatFileSize.js";
import { ORIGIN } from "../config.js";

const myFilesTable = document.getElementById("my-files-table");

async function fetchFiles() {
    try {
        const response = await api.get(`/files`);

        if (response.status !== 200) return;

        const files = response.data?.data;
        let myFilesTableHTML = "";

        console.log(files);

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
                <tr class="group hover:bg-indigo-50/30 transition-colors">
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
                            <button class="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors" title="Rename">
                                <i class="ri-edit-line"></i>
                            </button>
                            <a href="${ORIGIN}/api/v1/files/${file?._id}/download" class="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" title="Download">
                                <i class="ri-download-line"></i>
                            </a>
                            <button class="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <i class="ri-delete-bin-line"></i>
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
    } catch (error) {
        console.error(error);
    }
}

fetchFiles();
