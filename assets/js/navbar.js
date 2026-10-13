
/*--- Navbar Initialization ---*/
function cpInitializeNavbar() {
    const navbar = document.getElementById("cp-navbar");
    if (!navbar) {
        console.error("Navbar component was not found.");
        return;
    }
    /*--- Prevent Duplicate Initialization ---*/
    if (navbar.dataset.initialized === "true") {
        cpUpdateNavbarActiveLink();
        return;
    }
    navbar.dataset.initialized = "true";
    const menuToggle = navbar.querySelector("#cp-navbar-toggle");
    const mobileMenu = navbar.querySelector("#cp-navbar-mobile");
    const mobileLinks = navbar.querySelectorAll(".cp-navbar-mobile-link");
    /*--- Navbar Scroll Effect ---*/
    const updateNavbarScroll = () => {
        navbar.classList.toggle("cp-navbar-scrolled", window.scrollY > 30);
    };
    updateNavbarScroll();
    window.addEventListener("scroll", updateNavbarScroll, { passive: true });
    /*--- Active Navigation Links ---*/
    cpUpdateNavbarActiveLink();
    /*--- Mobile Menu State ---*/
    const setMenuState = (isOpen) => {
        if (!menuToggle || !mobileMenu) return;
        navbar.classList.toggle("cp-navbar-menu-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        mobileMenu.setAttribute("aria-hidden", String(!isOpen));
        mobileMenu.inert = !isOpen;
        document.body.classList.toggle("cp-navbar-no-scroll", isOpen);
    };
    /*--- Mobile Menu Toggle ---*/
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            setMenuState(menuToggle.getAttribute("aria-expanded") !== "true");
        });
        /*--- Close Menu On Link Click ---*/
        mobileLinks.forEach((link) => {
            link.addEventListener("click", () => setMenuState(false));
        });
        /*--- Close Menu On Escape ---*/
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
                setMenuState(false);
                menuToggle.focus();
            }
        });
        /*--- Close Menu On Outside Click ---*/
        document.addEventListener("click", (event) => {
            if (menuToggle.getAttribute("aria-expanded") === "true" && !navbar.contains(event.target)) {
                setMenuState(false);
            }
        });
        /*--- Close Menu On Desktop Resize ---*/
        window.addEventListener("resize", () => {
            if (window.innerWidth > 991 && menuToggle.getAttribute("aria-expanded") === "true") {
                setMenuState(false);
            }
        });
    }
}
/*--- Active Navigation Link ---*/
function cpUpdateNavbarActiveLink() {
    const navbar = document.getElementById("cp-navbar");
    if (!navbar) return;
    const currentPage = window.location.pathname.split("/").pop().toLowerCase() || "index.html";
    navbar.querySelectorAll("[data-page]").forEach((link) => {
        const linkPage = link.dataset.page.toLowerCase();
        const isActive = linkPage === currentPage;
        link.classList.toggle("active", isActive);
        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}
/*--- Expose Navbar Initializers ---*/
window.cpInitializeNavbar = cpInitializeNavbar;
window.cpUpdateNavbarActiveLink = cpUpdateNavbarActiveLink;
