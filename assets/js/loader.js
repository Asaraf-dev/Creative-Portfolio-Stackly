
/*--- Loader Initialization ---*/
(() => {
    const loader = document.getElementById("cp-ldr");
    if (!loader) return;
    const message = document.getElementById("cp-ldr-message");
    const particles = document.getElementById("cp-ldr-particles");
    const messages = [
        "Crafting something extraordinary",
        "Turning ideas into experiences",
        "Building digital experiences",
        "Making creativity happen",
        "Almost ready to explore"
    ];
    let messageIndex = 0;
    let messageInterval = null;
    let hideTimeout = null;
    let pageLoaded = document.readyState === "complete";
    let componentsLoaded = false;
    let isHidden = false;
    /*--- Create Floating Particles ---*/
    const createParticles = () => {
        if (!particles || particles.childElementCount) return;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 35; i++) {
            const particle = document.createElement("span");
            particle.className = "cp-ldr-particle";
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            const size = 2 + Math.random() * 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.animationDuration = `${4 + Math.random() * 5}s`;
            fragment.appendChild(particle);
        }
        particles.appendChild(fragment);
    };
    /*--- Rotate Loader Messages ---*/
    const startMessages = () => {
        if (!message || messageInterval) return;
        messageInterval = window.setInterval(() => {
            message.style.opacity = "0";
            message.style.transform = "translateY(5px)";
            window.setTimeout(() => {
                messageIndex = (messageIndex + 1) % messages.length;
                message.textContent = messages[messageIndex];
                message.style.opacity = "1";
                message.style.transform = "translateY(0)";
            }, 250);
        }, 1800);
    };
    /*--- Hide Loader ---*/
    const hideLoader = () => {
        if (isHidden) return;
        isHidden = true;
        window.clearInterval(messageInterval);
        window.clearTimeout(hideTimeout);
        loader.classList.add("cp-ldr-exit");
        window.setTimeout(() => {
            loader.classList.add("cp-ldr-hidden");
            loader.setAttribute("aria-hidden", "true");
            loader.setAttribute("hidden", "");
            document.body.classList.remove("cp-ldr-active");
        }, 750);
    };
    /*--- Check Loading Completion ---*/
    const checkReady = () => {
        if (pageLoaded && componentsLoaded) {
            window.clearTimeout(hideTimeout);
            hideTimeout = window.setTimeout(hideLoader, 350);
        }
    };
    /*--- Initial Loader State ---*/
    document.body.classList.add("cp-ldr-active");
    createParticles();
    startMessages();
    /*--- Browser Load Event ---*/
    window.addEventListener("load", () => {
        pageLoaded = true;
        checkReady();
    }, { once: true });
    /*--- Shared Components Ready ---*/
    document.addEventListener("cp:components-ready", () => {
        componentsLoaded = true;
        checkReady();
    }, { once: true });
    /*--- Handle Already Loaded Page ---*/
    if (pageLoaded) checkReady();
    /*--- Loader Safety Fallback ---*/
    hideTimeout = window.setTimeout(() => {
        componentsLoaded = true;
        pageLoaded = true;
        hideLoader();
    }, 10000);
    /*--- Expose Loader Controls ---*/
    window.cpShowLoader = () => {
        window.clearTimeout(hideTimeout);
        isHidden = false;
        loader.removeAttribute("hidden");
        loader.removeAttribute("aria-hidden");
        loader.classList.remove("cp-ldr-hidden", "cp-ldr-exit");
        document.body.classList.add("cp-ldr-active");
        startMessages();
    };
    window.cpHideLoader = hideLoader;
})();
