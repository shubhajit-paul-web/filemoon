const toggleSidebarBtn = document.querySelector("#toggle-sidebar-btn");
const sidebar = document.querySelector("#sidebar");

const closeSidebar = () => {
    sidebar.style.left = "-100%";
};

const openSidebar = () => {
    sidebar.style.left = "0px";
};

if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener("click", () => {
        if (sidebar.style.left === "0px") {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
}

// Optional: Close sidebar when clicking outside
document.addEventListener("click", (e) => {
    if (
        sidebar.style.left === "0px" &&
        !sidebar.contains(e.target) &&
        !toggleSidebarBtn.contains(e.target)
    ) {
        closeSidebar();
    }
});
