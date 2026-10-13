
/*--- Dashboard Initialization ---*/
document.addEventListener("DOMContentLoaded",function(){
  /*--- Dashboard Elements ---*/
  const layout=document.getElementById("cp-dashboard-layout");
  const sidebar=document.getElementById("cp-dashboard-sidebar");
  const toggle=document.getElementById("cp-dashboard-menu-toggle");
  const backdrop=document.getElementById("cp-dashboard-backdrop");
  const logout=document.getElementById("cp-dashboard-logout");
  const currentPage=window.location.pathname.split("/").pop().toLowerCase();

  /*--- Dashboard Page Titles ---*/
  const pageTitles={
    "admin-dashboard.html":"Overview",
    "client-dashboard.html":"Overview",
    "admin-analytics.html":"Analytics",
    "client-analytics.html":"Analytics",
    "admin-profile.html":"Profile",
    "client-profile.html":"Profile",
    "admin-settings.html":"Settings",
    "client-settings.html":"Settings"
  };
  const title=pageTitles[currentPage]||"Overview";
  document.title=title+" | Creative Portfolio Dashboard";
  document.querySelectorAll("[data-dashboard-title]").forEach(function(element){
    element.textContent=title;
  });

  /*--- Dashboard Workspace Label ---*/
  const isClient=currentPage.startsWith("client-");
  document.querySelectorAll("[data-dashboard-eyebrow]").forEach(function(element){
    element.textContent=isClient?"CLIENT WORKSPACE":"ADMIN WORKSPACE";
  });

  /*--- Overview Navigation ---*/
  const overviewLink=document.querySelector('[data-page="overview"]');
  if(overviewLink){
    overviewLink.href=isClient?"client-dashboard.html":"admin-dashboard.html";
  }

  /*--- Active Navigation Link ---*/
  document.querySelectorAll(".cp-dashboard-nav-link[data-page]").forEach(function(link){
    const page=link.dataset.page;
    const pageMatches={
      overview:["admin-dashboard.html","client-dashboard.html"],
      analytics:["admin-analytics.html","client-analytics.html"],
      profile:["admin-profile.html","client-profile.html"],
      settings:["admin-settings.html","client-settings.html"]
    };
    const isActive=(pageMatches[page]||[]).includes(currentPage);
    link.classList.toggle("active",isActive);
    if(isActive){
      link.setAttribute("aria-current","page");
    }else{
      link.removeAttribute("aria-current");
    }
  });

  /*--- Populate Login Email ---*/
  const email=sessionStorage.getItem("cpLoginEmail")||
    localStorage.getItem("cpLoginEmail")||
    sessionStorage.getItem("cpRegisteredEmail")||
    localStorage.getItem("cpRegisteredEmail")||
    "Not signed in";
  document.querySelectorAll("[data-user-email]").forEach(function(element){
    element.textContent=email;
    element.title=email;
  });

  /*--- Populate User Profile Details ---*/
  const registeredName=sessionStorage.getItem("cpRegisteredName")||
    localStorage.getItem("cpRegisteredName")||
    "Creative User";
  const registeredPhone=sessionStorage.getItem("cpRegisteredPhone")||
    localStorage.getItem("cpRegisteredPhone")||
    "Not provided";
  const role=sessionStorage.getItem("cpLoginRole")||
    localStorage.getItem("cpLoginRole")||
    "client";

  document.querySelectorAll("[data-user-name]").forEach(function(element){
    element.textContent=registeredName;
  });
  document.querySelectorAll("[data-user-first-name]").forEach(function(element){
    element.textContent=registeredName.split(/\s+/)[0]||"Creator";
  });
  document.querySelectorAll("[data-profile-name]").forEach(function(element){
    element.textContent=registeredName;
  });
  document.querySelectorAll("[data-profile-phone]").forEach(function(element){
    element.textContent=registeredPhone;
  });
  document.querySelectorAll("[data-user-role]").forEach(function(element){
    element.textContent=role==="admin"?"Administrator":"Client";
  });

  /*--- Profile Image Fallback ---*/
  document.querySelectorAll("[data-profile-image]").forEach(function(img){
    function handleImageError(){
      img.classList.add("cp-dashboard-avatar-image-hidden");
    }
    img.addEventListener("error",handleImageError);
    if(img.complete&&img.naturalWidth===0){
      handleImageError();
    }
  });

  /*--- Dashboard Date And Year ---*/
  const dateElement=document.getElementById("cp-dashboard-current-date");
  const yearElement=document.getElementById("cp-dashboard-year");
  if(dateElement){
    dateElement.textContent=new Intl.DateTimeFormat("en-IN",{
      day:"numeric",
      month:"short",
      year:"numeric"
    }).format(new Date());
  }
  if(yearElement){
    yearElement.textContent=new Date().getFullYear();
  }

  /*--- Mobile Sidebar Controls ---*/
  function openSidebar(){
    if(!layout)return;
    layout.classList.add("cp-dashboard-sidebar-open");
    if(toggle){
      toggle.setAttribute("aria-expanded","true");
      toggle.setAttribute("aria-label","Close navigation");
      toggle.innerHTML='<i class="bi bi-x-lg"></i>';
    }
    if(backdrop)backdrop.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
  }

  function closeSidebar(){
    if(!layout)return;
    layout.classList.remove("cp-dashboard-sidebar-open");
    if(toggle){
      toggle.setAttribute("aria-expanded","false");
      toggle.setAttribute("aria-label","Open navigation");
      toggle.innerHTML='<i class="bi bi-three-dots"></i>';
    }
    if(backdrop)backdrop.setAttribute("aria-hidden","true");
    document.body.style.overflow="";
  }

  if(toggle){
    toggle.addEventListener("click",function(){
      if(layout&&layout.classList.contains("cp-dashboard-sidebar-open")){
        closeSidebar();
      }else{
        openSidebar();
      }
    });
  }

  if(backdrop){
    backdrop.addEventListener("click",closeSidebar);
  }

  document.addEventListener("keydown",function(event){
    if(event.key==="Escape")closeSidebar();
  });

  if(sidebar){
    sidebar.querySelectorAll(".cp-dashboard-nav-link").forEach(function(link){
      link.addEventListener("click",function(){
        if(window.innerWidth<=991)closeSidebar();
      });
    });
  }

  window.addEventListener("resize",function(){
    if(window.innerWidth>991)closeSidebar();
  });

  /*--- Dashboard Logout ---*/
  if(logout){
    logout.addEventListener("click",function(event){
      event.preventDefault();
      sessionStorage.removeItem("cpLoginEmail");
      sessionStorage.removeItem("cpLoginRole");
      localStorage.removeItem("cpLoginEmail");
      localStorage.removeItem("cpLoginRole");
      window.location.href="login.html";
    });
  }
});
/*--- Dashboard Initialization End ---*/
