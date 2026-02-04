import api from "../apis/axios.js";

async function fetchShareHistory() {
    const sharesHistoryTable = document.getElementById("shares-history-table");
    let sharesHistoryTableContent = "";

    // Category map - icon, colors
    const categoryMap = {
        image: {
            icon: "ri-image-line",
            color: "bg-orange-100 text-orange-800",
        },
        video: {
            icon: "ri-video-line",
            color: "bg-blue-100 text-blue-600",
        },
        document: {
            icon: "ri-file-pdf-line",
            color: "bg-pink-100 text-pink-600",
        },
        audio: {
            icon: "ri-folder-music-line",
            color: "bg-purple-100 text-purple-600",
        },
    };

    try {
        const { data } = await api.get("/shares");
        const shares = data.data;

        shares.forEach((share) => {
            const { file } = share;
            const status = share.status === "active";

            sharesHistoryTableContent += `
                <tr class="group hover:bg-indigo-50/30 transition-colors">
                    <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${categoryMap[file.category]?.color}">
                                <i class="${categoryMap[file.category]?.icon}"></i>
                            </div>
                            <div class="min-w-0 max-w-[200px]">
                                <p class="font-medium text-zinc-800 truncate" title="Introduction to html">${file?.fileName}</p>
                                <p class="text-xs text-zinc-400 truncate">
                                    ${file?.type}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                            <div>
                                <p class="font-medium text-zinc-500">${share.to}</p>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 px-6 text-zinc-500 whitespace-nowrap">
                        ${moment(share.createdAt).format("Do MMM YYYY, hh:mm a")}
                    </td>
                    <td class="py-4 px-6">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-default ${status ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}">
                            <span class="w-1.5 h-1.5 rounded-full mr-1.5 ${status ? "bg-green-500" : "bg-red-500"}"
                            ></span>
                            ${status ? "Active" : "Expired"}
                        </span>
                    </td>
                    <td class="py-4 px-6">
                        <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onclick="openModelForRevokeAccess('${share._id}')" class="py-1.5 px-2.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Revoke Access">
                                ${status ? '<i class="ri-close-circle-line text-lg"></i>' : ""}
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        if (sharesHistoryTableContent) {
            sharesHistoryTable.innerHTML = sharesHistoryTableContent;
        }
    } catch (error) {
        console.error(error);
    }
}

window.openModelForRevokeAccess = function (fileId) {
    Swal.fire({
        title: "Are you sure?",
        text: "You want to revoke the file access!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "rgb(69, 71, 69)",
        confirmButtonText: "Yes, Revoke Access!",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Access Revoked!",
                text: "File access has been revoked successfully.",
                icon: "success",
            });
        }
    });
};

window.onload = async function () {
    fetchShareHistory();
};
