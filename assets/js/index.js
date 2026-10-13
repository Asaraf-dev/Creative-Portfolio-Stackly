/*--- Hero Section Start ---*/
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("cp-ind-hero");
  if (!hero) return;
  const particles = document.getElementById("cp-ind-hero-particles");
  const visual = document.getElementById("cp-ind-hero-visual");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /*--- Create Hero Particles ---*/
  if (particles && !particles.childElementCount && !reducedMotion) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 28; i++) {
      const particle = document.createElement("span");
      particle.className = "cp-ind-hero-particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      const size = 2 + Math.random() * 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.animationDuration = `${4 + Math.random() * 5}s`;
      fragment.appendChild(particle);
    }
    particles.appendChild(fragment);
  }
  /*--- Interactive Hero Visual ---*/
  if (visual && !reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    visual.addEventListener("pointermove", (event) => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      visual.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });
    visual.addEventListener("pointerleave", () => {
      visual.style.transform = "";
    });
  }
  /*--- Hero Scroll Link ---*/
  const scrollLink = hero.querySelector(".cp-ind-hero-scroll");
  if (scrollLink) {
    scrollLink.addEventListener("click", (event) => {
      const target = document.getElementById("cp-ind-hero-next");
      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  }
});
/*--- Hero Section End ---*/

/*--- Skills & Technologies Section Start ---*/
document.addEventListener("DOMContentLoaded", function () {
  const filters = document.querySelectorAll(".cp-ind-skills-filter");
  const items = document.querySelectorAll(".cp-ind-skills-item");
  filters.forEach(function (filter) {
    filter.addEventListener("click", function () {
      const category = filter.dataset.filter;
      filters.forEach(function (button) {
        const active = button === filter;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      items.forEach(function (item) {
        const visible = category === "all" || item.dataset.category === category;
        item.classList.toggle("is-hidden", !visible);
      });
    });
  });
});
/*--- Skills & Technologies Section End ---*/

/*--- Achievements & Statistics Section Start ---*/
document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector("#cp-ind-stats");
  if (!section) return;
  const counters = section.querySelectorAll(".cp-ind-stats-counter");
  const cards = section.querySelectorAll(".cp-ind-stats-card");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function showFinalValues() {
    counters.forEach(function (counter) {
      counter.textContent = counter.dataset.target;
    });
    cards.forEach(function (card) { card.classList.add("is-counted") });
  }
  function animateCounters() {
    if (reducedMotion) { showFinalValues(); return }
    counters.forEach(function (counter) {
      const target = Number(counter.dataset.target);
      const duration = 1200;
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(target * eased);
        if (progress < 1) { requestAnimationFrame(update) }
        else { counter.textContent = target }
      }
      requestAnimationFrame(update);
    });
    cards.forEach(function (card) { card.classList.add("is-counted") });
  }
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: .25 });
    observer.observe(section);
  } else { showFinalValues() }
});
/*--- Achievements & Statistics Section End ---*/

/*--- Creative Portfolio Scroll Reveal Animation ---*/
document.addEventListener("DOMContentLoaded", function () {
  const revealSelectors = [
    ".cp-ind-about-heading",
    ".cp-ind-about-visual",
    ".cp-ind-about-content",
    ".cp-ind-about-bottom",
    ".cp-ind-skills-heading",
    ".cp-ind-skills-toolbar",
    ".cp-ind-skills-item",
    ".cp-ind-skills-footer",
    ".cp-ind-projects-heading",
    ".cp-ind-projects-toolbar",
    ".cp-ind-projects-item",
    ".cp-ind-projects-bottom",
    ".cp-ind-workflow-heading",
    ".cp-ind-workflow-card",
    ".cp-ind-workflow-bottom",
    ".cp-ind-stats-heading",
    ".cp-ind-stats-panel",
    ".cp-ind-stats-note"
  ];
  const elements = Array.from(document.querySelectorAll(revealSelectors.join(",")));
  if (!elements.length) return;
  const revealImmediately = function () {
    elements.forEach(function (element) {
      element.classList.add("cp-revealed");
    });
  };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealImmediately();
    return;
  }
  document.body.classList.add("cp-reveal-ready");
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const siblings = Array.from(element.parentElement.children).filter(function (sibling) {
        return sibling.classList.contains("cp-reveal-item");
      });
      const index = siblings.indexOf(element);
      element.style.transitionDelay = (index >= 0 ? Math.min(index, 5) * 90 : 0) + "ms";
      element.classList.add("cp-revealed");
      observer.unobserve(element);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  elements.forEach(function (element) {
    element.classList.add("cp-reveal-item");
    observer.observe(element);
  });
});