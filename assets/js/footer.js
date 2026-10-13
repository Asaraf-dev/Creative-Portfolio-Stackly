
/*--- Footer Initialization ---*/
function cpInitializeFooter() {
    const footer = document.getElementById("cp-footer");
    if (!footer) {
        console.error("Footer component was not found.");
        return;
    }
    /*--- Prevent Duplicate Initialization ---*/
    if (footer.dataset.initialized === "true") {
        cpUpdateFooterTime();
        return;
    }
    footer.dataset.initialized = "true";
    /*--- Copyright Year ---*/
    const yearElement = footer.querySelector("#cp-footer-year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    /*--- Local Time Display ---*/
    cpUpdateFooterTime();
    if (window.cpFooterClock) {
        window.clearInterval(window.cpFooterClock);
    }
    window.cpFooterClock = window.setInterval(cpUpdateFooterTime, 1000);
    /*--- Back To Top ---*/
    const backToTopButton = footer.querySelector("#cp-footer-top-btn");
    if (backToTopButton) {
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
            });
        });
    }
}
/*--- Update Footer Local Time ---*/
function cpUpdateFooterTime() {
    const timeElement = document.getElementById("cp-footer-time");
    if (!timeElement) {
        console.warn("Footer time element #cp-footer-time was not found.");
        return;
    }
    timeElement.textContent = new Date().toLocaleTimeString("en-IN", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
}
/*--- Expose Footer Initializers ---*/
window.cpInitializeFooter = cpInitializeFooter;
window.cpUpdateFooterTime = cpUpdateFooterTime;
