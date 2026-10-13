
/*--- Component Loader Initialization ---*/
async function cpLoadComponent(component) {
    const placeholder = document.getElementById(component.placeholder);
    if (!placeholder) {
        console.warn(`Missing component placeholder: ${component.placeholder}`);
        return;
    }
    try {
        /*--- Fetch Component HTML ---*/
        const response = await fetch(component.url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${component.url}: ${response.status}`);
        }
        placeholder.innerHTML = await response.text();
        placeholder.dataset.componentLoaded = "true";
        /*--- Load Component JavaScript ---*/
        await cpLoadComponentScript(component.script);
        /*--- Initialize Component ---*/
        if (typeof window[component.initializer] !== "function") {
            throw new Error(`Initializer unavailable: ${component.initializer}`);
        }
        window[component.initializer]();
        /*--- Dispatch Component Ready Event ---*/
        document.dispatchEvent(new CustomEvent("cp:component-loaded", {
            detail: { name: component.name, element: placeholder }
        }));
    } catch (error) {
        placeholder.dataset.componentLoaded = "false";
        console.error(`Component error (${component.name}):`, error);
    }
}
/*--- Component Script Loader ---*/
function cpLoadComponentScript(src) {
    const absoluteUrl = new URL(src, document.baseURI).href;
    if (window.cpLoadedScripts?.has(absoluteUrl)) {
        return window.cpLoadedScripts.get(absoluteUrl);
    }
    if (!window.cpLoadedScripts) {
        window.cpLoadedScripts = new Map();
    }
    const existingScript = Array.from(document.scripts).find((script) => script.src === absoluteUrl);
    if (existingScript) {
        return Promise.resolve();
    }
    const scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = absoluteUrl;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
    });
    window.cpLoadedScripts.set(absoluteUrl, scriptPromise);
    return scriptPromise;
}
/*--- Load Shared Components ---*/
async function cpLoadAllComponents() {
    const components = [
        {
            name: "navbar",
            url: "assets/components/navbar.html",
            placeholder: "cp-navbar-placeholder",
            script: "assets/js/navbar.js",
            initializer: "cpInitializeNavbar"
        },
        {
            name: "footer",
            url: "assets/components/footer.html",
            placeholder: "cp-footer-placeholder",
            script: "assets/js/footer.js",
            initializer: "cpInitializeFooter"
        }
    ];
    await Promise.all(components.map(cpLoadComponent));
    document.dispatchEvent(new CustomEvent("cp:components-ready"));
}
/*--- Component Loader Ready State ---*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cpLoadAllComponents, { once: true });
} else {
    cpLoadAllComponents();
}
