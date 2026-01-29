import api from "./axios.js";
import formatFileSize from "../formatFileSize.js";

async function loadMetrics() {
    try {
        const response = await api.get("/dashboard/metrics");

        if (response.status !== 200 || !response.data?.data) return;

        const data = response.data.data;

        // Calculate total files count
        const totalFilesCount = data.reduce(
            (totalFiles, file) => (totalFiles += file.totalFiles),
            0
        );

        // File category elements
        const videosElem = document.getElementById("total-videos");
        const audioElem = document.getElementById("total-audio");
        const documentsElem = document.getElementById("total-documents");
        const imagesElem = document.getElementById("total-images");

        // File percentage per category
        const videosPercentageElem = document.getElementById("total-videos-percentage");
        const audioPercentageElem = document.getElementById("total-audio-percentage");
        const documentsPercentageElem = document.getElementById("total-documents-percentage");
        const imagesPercentageElem = document.getElementById("total-images-percentage");

        function showDataToMetricsCard(totalFilesElem, totalFiles, percentageElem, percentage) {
            totalFilesElem.textContent = totalFiles ?? 0;

            if (percentage) {
                percentageElem.textContent = `+${percentage}%`;
                percentageElem.classList.add("text-green-600", "bg-green-50");
            } else {
                percentageElem.textContent = `${percentage}%`;
                percentageElem.classList.add("text-zinc-500", "bg-zinc-100");
            }
        }

        data?.forEach((file) => {
            const totalFiles = file?.totalFiles;
            const percentage = Math.floor((totalFiles / totalFilesCount) * 100);

            switch (file?._id) {
                case "video":
                    showDataToMetricsCard(videosElem, totalFiles, videosPercentageElem, percentage);
                    break;
                case "audio":
                    showDataToMetricsCard(audioElem, totalFiles, audioPercentageElem, percentage);
                    break;
                case "document":
                    showDataToMetricsCard(
                        documentsElem,
                        totalFiles,
                        documentsPercentageElem,
                        percentage
                    );
                    break;
                case "image":
                    showDataToMetricsCard(imagesElem, totalFiles, imagesPercentageElem, percentage);
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
                    <td class="px-6 py-4">${formatFileSize(file?.size)}</td>
                    <td class="px-6 py-4">
                        <span class="bg-zinc-100 text-zinc-600 px-2 py-1 rounded text-xs">
                            ${file?.category[0]?.toUpperCase() + file?.category?.slice(1)}
                        </span>
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
