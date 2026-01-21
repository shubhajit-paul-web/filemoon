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
function closeDrawer() {
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
