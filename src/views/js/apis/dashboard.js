import api from "./axios.js";

async function loadMetrics() {
    try {
        const response = await api.get("/dashboard/metrics");

        if (response.status !== 200 || !response.data?.data) return;

        const data = response.data.data;

        // File category elements
        const videosElem = document.getElementById("total-videos");
        const audioElem = document.getElementById("total-audio");
        const documentsElem = document.getElementById("total-documents");
        const imagesElem = document.getElementById("total-images");

        data?.forEach((file) => {
            const totalFiles = file?.totalFiles;

            switch (file?._id) {
                case "video":
                    videosElem.textContent = totalFiles;
                    break;
                case "audio":
                    audioElem.textContent = totalFiles;
                    break;
                case "document":
                    documentsElem.textContent = totalFiles;
                    break;
                case "image":
                    imagesElem.textContent = totalFiles;
                    break;
            }
        });
    } catch (error) {
        console.error(error);
    }
}

async function fetchRecentUploadedFiles() {
    try {
        const response = await api.get("/files?limit=5&sortBy=createdAt&sortType=desc");

        if (response.status !== 200 || !response.data?.data) return;

        const data = response.data.data;

        const recentFilesElem = document.getElementById("recent-files");
        let recentFilesHTML = "";

        function returnFileIcon(category) {
            let icon = "";

            switch (category) {
                case "video":
                    icon = '<i class="ri-video-line text-xl text-blue-500"></i>';
                    break;
                case "image":
                    icon = '<i class="ri-image-line text-xl text-purple-500"></i>';
                    break;
                case "document":
                    icon = '<i class="ri-file-pdf-line text-xl text-red-500"></i>';
                    break;
            }

            return icon;
        }

        data?.forEach((file) => {
            recentFilesHTML += `
                <tr class="hover:bg-zinc-50/50 transition-colors">
                    <td class="px-6 py-4 font-medium text-zinc-800 flex items-center gap-3">
                        ${returnFileIcon(file?.category)}
                        ${file?.fileName}
                    </td>
                    <td class="px-6 py-4">${file?.size}</td>
                    <td class="px-6 py-4">
                        <span class="bg-zinc-100 text-zinc-600 px-2 py-1 rounded text-xs">
                            ${file?.category[0]?.toUpperCase() + file?.category?.slice(1)}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <button class="text-zinc-400 hover:text-zinc-600">
                            <i class="ri-more-2-fill text-lg"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        recentFilesElem.innerHTML = recentFilesHTML;
    } catch (error) {
        console.error(error);
    }
}

loadMetrics();
fetchRecentUploadedFiles();
