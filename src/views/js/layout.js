const toggleSidebarBtn = document.querySelector("#toggle-sidebar-btn");
const sidebar = document.querySelector("#sidebar");
const closeSidebarBtn = document.querySelector("#close-sidebar-btn");

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

if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", () => {
        closeSidebar();
    });
}

// Optional: Close sidebar when clicking outside on mobile
document.addEventListener("click", (e) => {
    if (window.innerWidth < 1024) {
        // Only on mobile/tablet
        if (
            sidebar.style.left === "0px" &&
            !sidebar.contains(e.target) &&
            !toggleSidebarBtn.contains(e.target)
        ) {
            closeSidebar();
        }
    }
});
