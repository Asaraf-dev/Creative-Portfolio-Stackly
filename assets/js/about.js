/*--- Beyond the Code Section Start ---*/
const ssIndBlogReadButtons = document.querySelectorAll(".cp-about-beyond-interest-decoration");
    if (ssIndBlogReadButtons.length) {
        ssIndBlogReadButtons.forEach(function (ssButton) {
            ssButton.addEventListener("click", function (ssEvent) {
                ssEvent.preventDefault();
                ssEvent.stopPropagation();
                window.location.href = "404.html";
            });
        });
    }
/*--- Beyond the Code Section End ---*/

/*--- About Page Scroll Reveal Animation ---*/
document.addEventListener("DOMContentLoaded",function(){
  const hero=document.querySelector("#cp-sub-hero");
  const revealSelectors=[
    ".cp-about-story-content",
    ".cp-about-story-visual",
    ".cp-about-story-bottom-item",
    ".cp-about-who-header",
    ".cp-about-who-identity",
    ".cp-about-who-trait",
    ".cp-about-who-quote",
    ".cp-about-journey-header",
    ".cp-about-journey-item",
    ".cp-about-journey-future",
    ".cp-about-value-header",
    ".cp-about-value-card",
    ".cp-about-beyond-header",
    ".cp-about-beyond-main",
    ".cp-about-beyond-interest",
    ".cp-about-beyond-bottom"
  ];
  const elements=Array.from(document.querySelectorAll(revealSelectors.join(",")));
  /*--- Hero Entrance Animation ---*/
  if(hero){
    const heroContent=hero.querySelector(".cp-sub-hero-content");
    const heroArt=hero.querySelector(".cp-sub-hero-art");
    if(heroContent)heroContent.classList.add("cp-reveal-hero");
    if(heroArt)heroArt.classList.add("cp-reveal-hero-art");
  }
  if(!elements.length)return;
  /*--- Reduced Motion and Fallback ---*/
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window)){
    elements.forEach(function(element){
      element.classList.add("cp-revealed");
    });
    return;
  }
  /*--- Prepare Reveal Elements ---*/
  document.body.classList.add("cp-reveal-ready");
  elements.forEach(function(element){
    element.classList.add("cp-reveal-item");
  });
  /*--- Reveal on Scroll ---*/
  const observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting)return;
      const element=entry.target;
      const siblings=Array.from(element.parentElement.children).filter(function(item){
        return item.classList.contains("cp-reveal-item");
      });
      const index=siblings.indexOf(element);
      element.style.setProperty("--cp-reveal-delay",Math.min(Math.max(index,0),5)*90+"ms");
      element.classList.add("cp-revealed");
      observer.unobserve(element);
    });
  },{threshold:.12,rootMargin:"0px 0px -35px 0px"});
  elements.forEach(function(element){
    observer.observe(element);
  });
});