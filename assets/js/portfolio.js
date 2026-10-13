/*--- All Projects Gallery Section Start ---*/
document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.querySelector("#cp-port-gallery");
    if (!gallery) return;
    const grid = gallery.querySelector("#cp-port-gallery-grid");
    const cards = Array.from(grid.querySelectorAll(".cp-port-gallery-card"));
    const search = gallery.querySelector("#cp-port-gallery-search");
    const sort = gallery.querySelector("#cp-port-gallery-sort");
    const categories = Array.from(gallery.querySelectorAll(".cp-port-gallery-category"));
    const showing = gallery.querySelector("#cp-port-gallery-showing");
    const total = gallery.querySelector("#cp-port-gallery-total");
    const totalResults = gallery.querySelector("#cp-port-gallery-total-results");
    const empty = gallery.querySelector("#cp-port-gallery-empty");
    const clear = gallery.querySelector("#cp-port-gallery-clear");
    const emptyReset = gallery.querySelector("#cp-port-gallery-empty-reset");
    const filterCount = gallery.querySelector("#cp-port-gallery-filter-count");
    let activeCategory = "all";
    const originalOrder = new Map(cards.map((card, index) => [card, index]));
    const formatNumber = value => String(value).padStart(2, "0");
    total.textContent = formatNumber(cards.length);
    totalResults.textContent = formatNumber(cards.length);
    function updateCategoryCounts() {
        categories.forEach(button => {
            const category = button.dataset.category;
            const count = category === "all" ? cards.length : cards.filter(card => card.dataset.category === category).length;
            const badge = button.querySelector("span");
            if (badge) badge.textContent = formatNumber(count);
        });
        if (filterCount) filterCount.textContent = formatNumber(categories.length - 1) + " FILTERS";
    }
    function updateActiveCategory() {
        categories.forEach(button => {
            const active = button.dataset.category === activeCategory;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }
    function updateClearButton() {
        const hasFilters = activeCategory !== "all" || search.value.trim() !== "" || sort.value !== "featured";
        clear.hidden = !hasFilters;
    }
    function sortCards() {
        const mode = sort.value;
        const sorted = [...cards].sort((a, b) => {
            if (mode === "newest") return b.dataset.date.localeCompare(a.dataset.date);
            if (mode === "oldest") return a.dataset.date.localeCompare(b.dataset.date);
            if (mode === "az") return a.dataset.title.localeCompare(b.dataset.title);
            if (mode === "za") return b.dataset.title.localeCompare(a.dataset.title);
            return Number(a.dataset.featured) - Number(b.dataset.featured) || originalOrder.get(a) - originalOrder.get(b);
        });
        sorted.forEach(card => grid.appendChild(card));
    }
    function filterProjects() {
        const query = search.value.trim().toLowerCase();
        let visibleCount = 0;
        cards.forEach(card => {
            const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
            const searchableText = (card.dataset.title + " " + card.dataset.category + " " + card.dataset.tech + " " + card.textContent).toLowerCase();
            const matchesSearch = !query || searchableText.includes(query);
            const visible = matchesCategory && matchesSearch;
            card.hidden = !visible;
            if (visible) visibleCount++;
        });
        showing.textContent = formatNumber(visibleCount);
        totalResults.textContent = formatNumber(cards.length);
        total.textContent = formatNumber(cards.length);
        empty.hidden = visibleCount !== 0;
        grid.hidden = visibleCount === 0;
        updateClearButton();
    }
    function applyFilters() {
        updateActiveCategory();
        sortCards();
        filterProjects();
    }
    categories.forEach(button => {
        button.addEventListener("click", function () {
            activeCategory = this.dataset.category;
            applyFilters();
        });
    });
    search.addEventListener("input", filterProjects);
    sort.addEventListener("change", function () {
        sortCards();
        filterProjects();
    });
    function resetFilters() {
        activeCategory = "all";
        search.value = "";
        sort.value = "featured";
        applyFilters();
    }
    clear.addEventListener("click", resetFilters);
    emptyReset.addEventListener("click", resetFilters);
    updateCategoryCounts();
    applyFilters();
});
/*--- All Projects Gallery Section End ---*/

/*--- Technologies Used Section Start ---*/
document.addEventListener("DOMContentLoaded",function(){
  const section=document.querySelector("#cp-port-tech");
  if(!section)return;
  const cards=Array.from(section.querySelectorAll(".cp-port-tech-card"));
  const filters=Array.from(section.querySelectorAll(".cp-port-tech-filter"));
  const count=section.querySelector("#cp-port-tech-count");
  const grid=section.querySelector("#cp-port-tech-grid");
  const empty=section.querySelector("#cp-port-tech-empty");
  const reset=section.querySelector("#cp-port-tech-reset");
  let activeFilter="all";
  const formatNumber=value=>String(value).padStart(2,"0");
  count.textContent=formatNumber(cards.length);
  function updateCounts(){
    filters.forEach(button=>{
      const category=button.dataset.techFilter;
      const total=category==="all"?cards.length:cards.filter(card=>card.dataset.techCategory===category).length;
      const badge=button.querySelector("span");
      if(badge)badge.textContent=formatNumber(total);
    });
  }
  function filterTechnologies(){
    let visibleCount=0;
    cards.forEach(card=>{
      const visible=activeFilter==="all"||card.dataset.techCategory===activeFilter;
      card.hidden=!visible;
      if(visible)visibleCount++;
    });
    count.textContent=formatNumber(visibleCount);
    grid.hidden=visibleCount===0;
    empty.hidden=visibleCount!==0;
    filters.forEach(button=>{
      const active=button.dataset.techFilter===activeFilter;
      button.classList.toggle("active",active);
      button.setAttribute("aria-pressed",String(active));
    });
  }
  filters.forEach(button=>{
    button.addEventListener("click",function(){
      activeFilter=this.dataset.techFilter;
      filterTechnologies();
    });
  });
  reset.addEventListener("click",function(){
    activeFilter="all";
    filterTechnologies();
  });
  updateCounts();
  filterTechnologies();
});
/*--- Technologies Used Section End ---*/

/*--- Portfolio Page Scroll Reveal Animation ---*/
(function(){
  function initPortfolioReveal(){
    const hero=document.querySelector("#cp-sub-hero");
    const revealSelectors=[
      ".cp-port-gallery-header",
      ".cp-port-gallery-toolbar",
      ".cp-port-gallery-filter-area",
      ".cp-port-gallery-card",
      ".cp-port-gallery-empty",
      ".cp-port-gallery-bottom",
      ".cp-port-tech-header",
      ".cp-port-tech-toolbar",
      ".cp-port-tech-card",
      ".cp-port-tech-empty",
      ".cp-port-tech-footer"
    ];
    const elements=Array.from(document.querySelectorAll(revealSelectors.join(",")));
    if(hero){
      const heroContent=hero.querySelector(".cp-sub-hero-content");
      const heroArt=hero.querySelector(".cp-sub-hero-art");
      if(heroContent)heroContent.classList.add("cp-port-hero-reveal");
      if(heroArt)heroArt.classList.add("cp-port-hero-art-reveal");
    }
    if(!elements.length)return;
    const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduceMotion||!("IntersectionObserver" in window)){
      elements.forEach(function(element){element.classList.add("cp-port-revealed");});
      return;
    }
    document.body.classList.add("cp-reveal-ready");
    elements.forEach(function(element){element.classList.add("cp-port-reveal-item");});
    const observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting)return;
        const element=entry.target;
        const siblings=Array.from(element.parentElement.children).filter(function(item){
          return item.classList.contains("cp-port-reveal-item");
        });
        const index=Math.max(siblings.indexOf(element),0);
        element.style.setProperty("--cp-reveal-delay",Math.min(index,5)*85+"ms");
        element.classList.add("cp-port-revealed");
        observer.unobserve(element);
      });
    },{threshold:.12,rootMargin:"0px 0px -35px 0px"});
    elements.forEach(function(element){observer.observe(element);});
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",initPortfolioReveal);
  }else{
    initPortfolioReveal();
  }
})();
/*--- Portfolio Page Scroll Reveal Animation End ---*/
