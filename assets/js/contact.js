/*--- Contact Form Section Start ---*/
document.addEventListener("DOMContentLoaded",function(){
  const form=document.getElementById("cp-cont-form-element");
  const nameInput=document.getElementById("cp-cont-form-name");
  const phoneInput=document.getElementById("cp-cont-form-phone");
  const popup=document.getElementById("cp-cont-form-popup");
  const popupBox=popup.querySelector(".cp-cont-form-popup-box");
  const popupMessage=document.getElementById("cp-cont-form-popup-message");
  const popupOk=document.getElementById("cp-cont-form-popup-ok");
  const closeButtons=popup.querySelectorAll("[data-popup-close]");
  let previousFocus=null;
  if(!form||!nameInput||!phoneInput||!popup)return;
  /*--- Name Input Restriction ---*/
  nameInput.addEventListener("input",function(){
    const start=this.selectionStart;
    const oldValue=this.value;
    const cleanValue=oldValue.replace(/[^A-Za-z ]/g,"").replace(/ {2,}/g," ");
    if(oldValue!==cleanValue){
      const removedBeforeCursor=oldValue.slice(0,start).replace(/[^A-Za-z ]/g,"").replace(/ {2,}/g," ").length;
      this.value=cleanValue;
      this.setSelectionRange(removedBeforeCursor,removedBeforeCursor);
    }
    this.setCustomValidity("");
  });
  nameInput.addEventListener("blur",function(){
    this.value=this.value.trim().replace(/ +/g," ");
  });
  /*--- Phone Number Input Restriction ---*/
  phoneInput.addEventListener("input",function(){
    const start=this.selectionStart;
    const cleanValue=this.value.replace(/\D/g,"").slice(0,10);
    if(this.value!==cleanValue){
      this.value=cleanValue;
      this.setSelectionRange(Math.min(start,cleanValue.length),Math.min(start,cleanValue.length));
    }
    this.setCustomValidity("");
  });
  /*--- Native Validation Setup ---*/
  form.querySelectorAll("input,select,textarea").forEach(function(field){
    field.addEventListener("input",function(){
      if(field===nameInput||field===phoneInput){
        field.setCustomValidity("");
      }
    });
  });
  /*--- Open Success Popup ---*/
  function openPopup(){
    previousFocus=document.activeElement;
    popup.hidden=false;
    document.body.style.overflow="hidden";
    popupOk.focus();
  }
  /*--- Close Success Popup ---*/
  function closePopup(){
    popup.hidden=true;
    document.body.style.overflow="";
    if(previousFocus&&typeof previousFocus.focus==="function")previousFocus.focus();
  }
  closeButtons.forEach(function(button){
    button.addEventListener("click",closePopup);
  });
  popupOk.addEventListener("click",closePopup);
  document.addEventListener("keydown",function(event){
    if(event.key==="Escape"&&!popup.hidden)closePopup();
    if(event.key==="Tab"&&!popup.hidden){
      const focusable=Array.from(popup.querySelectorAll("button:not([disabled])"));
      if(!focusable.length)return;
      const first=focusable[0];
      const last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){
        event.preventDefault();
        last.focus();
      }else if(!event.shiftKey&&document.activeElement===last){
        event.preventDefault();
        first.focus();
      }
    }
  });
  /*--- Form Submission ---*/
  form.addEventListener("submit",function(event){
    event.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    popupMessage.textContent="Your form has been submitted successfully. Thank you for reaching out!";
    openPopup();
    form.reset();
  });
});
/*--- Contact Form Section End ---*/

/*--- Frequently Asked Questions Section Start ---*/
document.addEventListener("DOMContentLoaded",function(){
  const section=document.getElementById("cp-cont-faq");
  if(!section)return;
  const items=Array.from(section.querySelectorAll(".cp-cont-faq-item"));
  function setItem(item,open){
    const button=item.querySelector(".cp-cont-faq-question");
    const answer=item.querySelector(".cp-cont-faq-answer");
    item.classList.toggle("active",open);
    button.setAttribute("aria-expanded",String(open));
    answer.hidden=!open;
  }
  items.forEach(function(item){
    const button=item.querySelector(".cp-cont-faq-question");
    const answer=item.querySelector(".cp-cont-faq-answer");
    const initiallyOpen=item.classList.contains("active");
    setItem(item,initiallyOpen);
    button.addEventListener("click",function(){
      const shouldOpen=button.getAttribute("aria-expanded")!=="true";
      items.forEach(function(other){
        if(other!==item)setItem(other,false);
      });
      setItem(item,shouldOpen);
    });
  });
});
/*--- Frequently Asked Questions Section End ---*/


/*--- Contact Page Scroll Reveal Animation ---*/
(function(){
  function initContactReveal(){
    const hero=document.querySelector("#cp-sub-hero");
    const selectors=[
      ".cp-cont-info-header",
      ".cp-cont-info-card",
      ".cp-cont-info-bottom",
      ".cp-cont-form-intro",
      ".cp-cont-form-panel",
      ".cp-cont-availability-header",
      ".cp-cont-availability-status",
      ".cp-cont-availability-card",
      ".cp-cont-availability-process-heading",
      ".cp-cont-availability-step",
      ".cp-cont-availability-bottom",
      ".cp-cont-faq-intro",
      ".cp-cont-faq-item",
      ".cp-cont-faq-bottom"
    ];
    const elements=Array.from(document.querySelectorAll(selectors.join(",")));
    if(hero){
      const content=hero.querySelector(".cp-sub-hero-content");
      const art=hero.querySelector(".cp-sub-hero-art");
      if(content)content.classList.add("cp-cont-hero-content-reveal");
      if(art)art.classList.add("cp-cont-hero-art-reveal");
    }
    if(!elements.length)return;
    const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reducedMotion||!("IntersectionObserver" in window)){
      elements.forEach(function(element){
        element.classList.add("cp-cont-revealed");
      });
      return;
    }
    document.body.classList.add("cp-reveal-ready");
    elements.forEach(function(element){
      element.classList.add("cp-cont-reveal-item");
    });
    const observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting)return;
        const element=entry.target;
        const siblings=Array.from(element.parentElement.children).filter(function(item){
          return item.classList.contains("cp-cont-reveal-item");
        });
        const index=Math.max(siblings.indexOf(element),0);
        element.style.setProperty("--cp-reveal-delay",Math.min(index,4)*90+"ms");
        element.classList.add("cp-cont-revealed");
        observer.unobserve(element);
      });
    },{threshold:.12,rootMargin:"0px 0px -35px 0px"});
    elements.forEach(function(element){
      observer.observe(element);
    });
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",initContactReveal);
  }else{
    initContactReveal();
  }
})();
/*--- Contact Page Scroll Reveal Animation End ---*/
