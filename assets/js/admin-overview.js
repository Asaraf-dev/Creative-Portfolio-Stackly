
/*--- Admin Overview Initialization ---*/
document.addEventListener("DOMContentLoaded",function(){
  const firstNameElement=document.querySelector("[data-admin-first-name]");
  const dateElement=document.getElementById("cp-admin-overview-date");
  const yearElement=document.getElementById("cp-admin-overview-year");
  const refreshButton=document.getElementById("cp-admin-overview-refresh");
  /*--- Admin Welcome Name ---*/
  const registeredName=sessionStorage.getItem("cpRegisteredName")||localStorage.getItem("cpRegisteredName")||"Admin";
  if(firstNameElement){
    firstNameElement.textContent=registeredName.trim().split(/\s+/)[0]||"Admin";
  }
  /*--- Current Date And Year ---*/
  function updateDate(){
    const now=new Date();
    if(dateElement){
      dateElement.textContent=new Intl.DateTimeFormat("en-IN",{
        day:"numeric",
        month:"short",
        year:"numeric"
      }).format(now);
    }
    if(yearElement)yearElement.textContent=now.getFullYear();
  }
  updateDate();
  /*--- Refresh Overview Display ---*/
  if(refreshButton){
    refreshButton.addEventListener("click",function(){
      if(refreshButton.classList.contains("is-refreshing"))return;
      refreshButton.classList.add("is-refreshing");
      refreshButton.disabled=true;
      updateDate();
      window.setTimeout(function(){
        refreshButton.classList.remove("is-refreshing");
        refreshButton.disabled=false;
      },500);
    });
  }
});
/*--- Admin Overview Initialization End ---*/
