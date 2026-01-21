const toggleSidebarBtn = document.querySelector("#toggle-sidebar-btn");
const sidebar = document.querySelector("#sidebar");

toggleSidebarBtn.addEventListener("click", () => {
	sidebar.classList.toggle("hidden");
});
