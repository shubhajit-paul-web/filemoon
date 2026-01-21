const toggleSidebarBtn = document.querySelector("#toggle-sidebar-btn");
const sidebar = document.querySelector("#sidebar");

toggleSidebarBtn.addEventListener("click", () => {
	if (sidebar.style.left === "0px") {
		sidebar.style.left = "-26vw";
	} else {
		sidebar.style.left = "0px";
	}
});
