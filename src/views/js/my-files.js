// Get elements
const fileDrawer = document.getElementById("file-drawer");
const drawerPanel = document.getElementById("drawer-panel");
const drawerBackdrop = document.getElementById("drawer-backdrop");
const addFileBtn = document.querySelector("button:has(.ri-add-line)");
const closeDrawerBtn = document.getElementById("close-drawer-btn");
const cancelBtn = document.getElementById("cancel-btn");
const fileInput = document.getElementById("file-input");
const fileDropZone = document.getElementById("file-drop-zone");
const selectedFileDisplay = document.getElementById("selected-file-display");
const removeFileBtn = document.getElementById("remove-file-btn");

// Open drawer
function openDrawer() {
    fileDrawer.classList.remove("hidden");
    setTimeout(() => {
        drawerPanel.classList.remove("translate-x-full");
    }, 10);
}

// Close drawer
export function closeDrawer() {
    drawerPanel.classList.add("translate-x-full");
    setTimeout(() => {
        fileDrawer.classList.add("hidden");
    }, 300);
}

// Event listeners
addFileBtn.addEventListener("click", openDrawer);
closeDrawerBtn.addEventListener("click", closeDrawer);
cancelBtn.addEventListener("click", closeDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);

// File input handling
fileDropZone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        displaySelectedFile(file);
    }
});

// Drag and drop
fileDropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileDropZone.classList.add("border-purple-500", "bg-purple-50");
});

fileDropZone.addEventListener("dragleave", () => {
    fileDropZone.classList.remove("border-purple-500", "bg-purple-50");
});

fileDropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    fileDropZone.classList.remove("border-purple-500", "bg-purple-50");
    const file = e.dataTransfer.files[0];
    if (file) {
        fileInput.files = e.dataTransfer.files;
        displaySelectedFile(file);
    }
});

// Display selected file
function displaySelectedFile(file) {
    const fileName = file.name;
    const fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";

    document.getElementById("selected-file-name").textContent = fileName;
    document.getElementById("selected-file-size").textContent = fileSize;

    fileDropZone.classList.add("hidden");
    selectedFileDisplay.classList.remove("hidden");
}

// Remove file
removeFileBtn.addEventListener("click", () => {
    fileInput.value = "";
    fileDropZone.classList.remove("hidden");
    selectedFileDisplay.classList.add("hidden");
});

// Edit File Modal Elements
const editFileModal = document.getElementById("edit-file-modal");
const editModalPanel = document.getElementById("edit-modal-panel");
const editModalBackdrop = document.getElementById("edit-modal-backdrop");
const closeEditModalBtn = document.getElementById("close-edit-modal-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const editFileForm = document.getElementById("edit-file-form");
const editFileId = document.getElementById("edit-file-id");
const editFilenameInput = document.getElementById("edit-filename-input");
const editDescriptionInput = document.getElementById("edit-description-input");

// Open edit modal
function openEditModal(fileId, fileName, description) {
    editFileId.value = fileId;
    editFilenameInput.value = fileName;
    editDescriptionInput.value = description || "";

    editFileModal.classList.remove("hidden");
    setTimeout(() => {
        editModalPanel.classList.remove("scale-95", "opacity-0");
        editModalPanel.classList.add("scale-100", "opacity-100");
    }, 10);
}

// Close edit modal
function closeEditModal() {
    editModalPanel.classList.remove("scale-100", "opacity-100");
    editModalPanel.classList.add("scale-95", "opacity-0");
    setTimeout(() => {
        editFileModal.classList.add("hidden");
        // Reset form
        editFileForm.reset();
    }, 300);
}

// Event listeners for edit modal
closeEditModalBtn.addEventListener("click", closeEditModal);
cancelEditBtn.addEventListener("click", closeEditModal);
editModalBackdrop.addEventListener("click", closeEditModal);

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !editFileModal.classList.contains("hidden")) {
        closeEditModal();
    }
});

// Handle edit button clicks (using event delegation for dynamically added elements)
document.getElementById("my-files-table").addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-file-btn");
    if (editBtn) {
        const fileId = editBtn.dataset.fileId;
        const fileName = editBtn.dataset.fileName;
        const description = editBtn.dataset.fileDescription;
        openEditModal(fileId, fileName, description);
    }
});

// Handle edit form submission
import api from "./apis/axios.js";
import { fetchFiles } from "./apis/my-files.js";

const notyf = new Notyf({
    position: {
        y: "top",
        x: "center",
    },
});

editFileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileId = editFileId.value;
    const fileName = editFilenameInput.value;
    const description = editDescriptionInput.value;

    try {
        const res = await api.patch(`/files/${fileId}`, {
            fileName,
            description,
        });

        if (res.status === 200) {
            notyf.success("File updated successfully");

            fetchFiles();
            closeEditModal();
        }
    } catch (error) {
        notyf.error(error?.response?.data?.message);
    }
});

const filesFilterBtns = document.querySelectorAll(".files-filter-btn");

filesFilterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        filesFilterBtns.forEach((button) => button.removeAttribute("style"));

        const activeBtn = e.target;

        activeBtn.style.backgroundColor = "#333";
        activeBtn.style.color = "#fff";
    });
});
