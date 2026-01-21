const toggleSidebarBtn = document.querySelector("#toggle-sidebar-btn");
const sidebar = document.querySelector("#sidebar");

toggleSidebarBtn.addEventListener("click", () => {
	const isActive = sidebar.classList.contains("active-sidebar");

	if (isActive) {
		sidebar.style.width = "0px";
		sidebar.classList.remove("active-sidebar");
	} else {
		sidebar.style.width = "23vw";
		sidebar.classList.add("active-sidebar");
	}
});
