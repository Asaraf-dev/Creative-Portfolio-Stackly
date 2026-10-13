
/*--- Services Page Scroll Reveal Animation ---*/
(function(){
  function initServicesReveal(){
    const hero=document.querySelector("#cp-sub-hero");
    const selectors=[
      ".cp-serv-overview-header",
      ".cp-serv-overview-card",
      ".cp-serv-overview-bottom",
      ".cp-serv-details-heading",
      ".cp-serv-details-item",
      ".cp-serv-details-note"
    ];
    const elements=Array.from(document.querySelectorAll(selectors.join(",")));
    if(hero){
      const content=hero.querySelector(".cp-sub-hero-content");
      const art=hero.querySelector(".cp-sub-hero-art");
      if(content)content.classList.add("cp-serv-hero-content-reveal");
      if(art)art.classList.add("cp-serv-hero-art-reveal");
    }
    if(!elements.length)return;
    const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reducedMotion||!("IntersectionObserver" in window)){
      elements.forEach(function(element){element.classList.add("cp-serv-revealed");});
      return;
    }
    document.body.classList.add("cp-reveal-ready");
    elements.forEach(function(element){element.classList.add("cp-serv-reveal-item");});
    const observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting)return;
        const element=entry.target;
        const siblings=Array.from(element.parentElement.children).filter(function(item){
          return item.classList.contains("cp-serv-reveal-item");
        });
        const index=Math.max(siblings.indexOf(element),0);
        element.style.setProperty("--cp-reveal-delay",Math.min(index,4)*100+"ms");
        element.classList.add("cp-serv-revealed");
        observer.unobserve(element);
      });
    },{threshold:.12,rootMargin:"0px 0px -35px 0px"});
    elements.forEach(function(element){observer.observe(element);});
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",initServicesReveal);
  }else{
    initServicesReveal();
  }
})();
/*--- Services Page Scroll Reveal Animation End ---*/
