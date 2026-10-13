
/*--- Client Overview Initialization ---*/
document.addEventListener("DOMContentLoaded",function(){
  /*--- Current Date ---*/
  const dateElement=document.getElementById("cp-client-overview-date");
  const yearElement=document.getElementById("cp-client-overview-year");
  const now=new Date();
  if(dateElement){
    dateElement.textContent=new Intl.DateTimeFormat("en-IN",{
      day:"numeric",
      month:"short",
      year:"numeric"
    }).format(now);
  }
  if(yearElement){
    yearElement.textContent=now.getFullYear();
  }

  /*--- Project Statistics Formatting ---*/
  document.querySelectorAll("[data-client-stat]").forEach(function(element){
    const value=Number(element.textContent.trim());
    if(Number.isFinite(value)){
      element.textContent=String(value).padStart(2,"0");
    }
  });

  /*--- Project Progress Accessibility ---*/
  document.querySelectorAll(".cp-client-overview-progress-track").forEach(function(track){
    const progress=track.querySelector("span");
    if(!progress)return;
    const match=progress.style.width.match(/^(\d+(?:\.\d+)?)%$/);
    if(!match)return;
    const percentage=Math.min(100,Math.max(0,Number(match[1])));
    track.setAttribute("role","progressbar");
    track.setAttribute("aria-label","Project completion");
    track.setAttribute("aria-valuemin","0");
    track.setAttribute("aria-valuemax","100");
    track.setAttribute("aria-valuenow",String(percentage));
  });

  /*--- Project Status Chart Accessibility ---*/
  const chart=document.getElementById("cp-client-overview-status-chart");
  if(chart){
    chart.setAttribute("role","img");
    chart.setAttribute("aria-label","Project status breakdown: 2 in progress, 1 completed, and 1 in review.");
  }

  /*--- Overview Initialization Complete ---*/
});
/*--- Client Overview Initialization End ---*/
