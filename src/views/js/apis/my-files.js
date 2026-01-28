import api from "./axios.js";
import formatFileSize from "../formatFileSize.js";

const myFilesTable = document.getElementById("my-files-table");

async function fetchFiles() {
    try {
        const response = await api.get(`/files`);

        if (response.status !== 200) return;

        const files = response.data?.data;
        let myFilesTableHTML = "";

        console.log(files);

        files?.forEach((file) => {
            myFilesTableHTML += `
                <tr class="group hover:bg-indigo-50/30 transition-colors">
                    <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                                <i class="ri-image-line"></i>
                            </div>
                            <div>
                                <p class="font-medium text-zinc-800 group-hover:text-indigo-600 transition-colors">
                                    ${file?.fileName}
                                </p>
                                <p class="text-xs text-zinc-400">landscape-bg.png</p>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
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
                            <button class="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download">
                                <i class="ri-download-line"></i>
                            </button>
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
