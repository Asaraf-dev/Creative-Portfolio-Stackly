
/*--- Reusable Subpage Hero ---*/
document.addEventListener("DOMContentLoaded",function(){
  const hero=document.querySelector("#cp-sub-hero");
  if(!hero)return;
  const get=function(name,fallback){
    return hero.dataset[name]||fallback;
  };
  const setText=function(selector,value){
    const element=hero.querySelector(selector);
    if(element&&value)element.textContent=value;
  };
  setText(".cp-sub-hero-eyebrow-text",get("eyebrow","EXPLORE MY PORTFOLIO"));
  setText(".cp-sub-hero-title-main",get("title","Ideas made"));
  const highlight=hero.querySelector(".cp-sub-hero-title-highlight");
  if(highlight){
    const words=get("highlight","digital.");
    const dot=document.createElement("span");
    dot.className="cp-sub-hero-title-dot";
    dot.textContent=".";
    highlight.textContent=words.replace(/\.$/,"");
    highlight.appendChild(dot);
  }
  setText(".cp-sub-hero-description",get("description","Creative ideas brought to life through thoughtful development."));
  setText(".cp-sub-hero-breadcrumb-current",get("breadcrumb","Explore"));
  const primary=hero.querySelector(".cp-sub-hero-btn-primary");
  if(primary){
    primary.querySelector("span").textContent=get("primaryText","Explore My Work");
    primary.href=get("primaryLink","404.html");
  }
  const secondary=hero.querySelector(".cp-sub-hero-btn-secondary");
  if(secondary){
    secondary.querySelector("span").textContent=get("secondaryText","Let's Connect");
    secondary.href=get("secondaryLink","404.html");
  }
  const page=get("page","page");
  hero.dataset.page=page;
  hero.classList.add("cp-sub-hero-ready");
  /*--- Pointer Interaction ---*/
  const art=hero.querySelector(".cp-sub-hero-art");
  const orb=hero.querySelector(".cp-sub-hero-orb");
  if(art&&orb&&window.matchMedia("(hover:hover) and (pointer:fine)").matches&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    art.addEventListener("pointermove",function(event){
      const rect=art.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      orb.style.translate=(x*10)+"px "+(y*10)+"px";
    });
    art.addEventListener("pointerleave",function(){
      orb.style.translate="0 0";
    });
  }
  /*--- Scroll Link ---*/
  const scrollLink=hero.querySelector(".cp-sub-hero-scroll");
  if(scrollLink){
    scrollLink.addEventListener("click",function(event){
      const target=document.querySelector("#cp-sub-hero-next");
      if(target){
        event.preventDefault();
        target.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
      }
    });
  }
});
