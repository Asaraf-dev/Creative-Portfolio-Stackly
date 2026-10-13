
/*--- 404 Page Initialization ---*/
document.addEventListener("DOMContentLoaded", () => {
    const page = document.getElementById("cp-404");
    if (!page) return;
    const particleContainer = document.getElementById("cp-404-particles");
    const backButton = document.getElementById("cp-404-back");
    const hint = document.getElementById("cp-404-hint");
    const year = document.getElementById("cp-404-year");
    /*--- Copyright Year ---*/
    if (year) {
        year.textContent = new Date().getFullYear();
    }
    /*--- Create Floating Particles ---*/
    if (particleContainer && !particleContainer.childElementCount) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 35; i++) {
            const particle = document.createElement("span");
            particle.className = "cp-404-particle";
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            const size = 2 + Math.random() * 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDelay = `${Math.random() * 6}s`;
            particle.style.animationDuration = `${4 + Math.random() * 5}s`;
            fragment.appendChild(particle);
        }
        particleContainer.appendChild(fragment);
    }
    /*--- Mouse Follow Glow ---*/
    let mouseFrame = null;
    page.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse" || mouseFrame !== null) return;
        mouseFrame = window.requestAnimationFrame(() => {
            const rect = page.getBoundingClientRect();
            page.style.setProperty("--cp-404-mouse-x", `${event.clientX - rect.left}px`);
            page.style.setProperty("--cp-404-mouse-y", `${event.clientY - rect.top}px`);
            mouseFrame = null;
        });
    }, { passive: true });
    /*--- Go Back Navigation ---*/
    if (backButton) {
        backButton.addEventListener("click", () => {
            const hasPreviousPage = window.history.length > 1 && document.referrer !== "";
            const previousUrl = document.referrer;
            let canGoBack = hasPreviousPage;
            if (canGoBack) {
                try {
                    canGoBack = new URL(previousUrl).origin === window.location.origin;
                } catch {
                    canGoBack = false;
                }
            }
            if (canGoBack) {
                window.history.back();
            } else {
                if (hint) {
                    hint.textContent = "No previous page found. Taking you back home instead.";
                }
                window.location.href = "index.html";
            }
        });
    }
});
