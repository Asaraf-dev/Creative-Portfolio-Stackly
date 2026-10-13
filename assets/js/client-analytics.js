
/*--- Client Analytics Initialization ---*/
document.addEventListener("DOMContentLoaded",function(){
  /*--- Elements ---*/
  const rangeSelect=document.getElementById("cp-client-analytics-range");
  const exportButton=document.getElementById("cp-client-analytics-export");
  const yearElement=document.getElementById("cp-client-analytics-year");
  const rowsContainer=document.getElementById("cp-client-analytics-project-rows");
  const emptyState=document.getElementById("cp-client-analytics-empty");
  const projectCount=document.getElementById("cp-client-analytics-project-count");
  const chartLine=document.getElementById("cp-client-analytics-chart-line");
  const chartArea=document.getElementById("cp-client-analytics-chart-area");
  const chartPoints=document.getElementById("cp-client-analytics-chart-points");
  const chartLabels=document.getElementById("cp-client-analytics-x-labels");
  const donut=document.getElementById("cp-client-analytics-donut");
  const donutTotal=document.getElementById("cp-client-analytics-donut-total");
  const chartSummary=document.getElementById("cp-client-analytics-chart-summary-value");

  /*--- Current Year ---*/
  if(yearElement){
    yearElement.textContent=new Date().getFullYear();
  }

  /*--- Demo Analytics Data ---*/
  const analyticsData={
    "7":{
      progress:68,
      trend:[42,47,53,56,61,65,68],
      labels:["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"]
    },
    "30":{
      progress:68,
      trend:[25,32,38,45,51,59,68],
      labels:["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6","Week 7"]
    },
    "90":{
      progress:68,
      trend:[12,19,27,35,43,55,68],
      labels:["Period 1","Period 2","Period 3","Period 4","Period 5","Period 6","Period 7"]
    }
  };

  /*--- Read Project Rows ---*/
  function getProjectRows(){
    if(!rowsContainer)return [];
    return Array.from(rowsContainer.querySelectorAll("tr"));
  }

  /*--- Format Project Counts ---*/
  function formatCount(value){
    return String(value).padStart(2,"0");
  }

  /*--- Update Project Statistics ---*/
  function updateProjectStatistics(){
    const rows=getProjectRows();
    const total=rows.length;
    const completed=rows.filter(function(row){
      return row.dataset.projectStatus==="completed";
    }).length;
    const review=rows.filter(function(row){
      return row.dataset.projectStatus==="review";
    }).length;
    const active=rows.filter(function(row){
      return row.dataset.projectStatus==="progress";
    }).length;

    const metricValues={
      total:formatCount(total),
      completed:formatCount(completed)
    };

    Object.keys(metricValues).forEach(function(key){
      const element=document.querySelector('[data-analytics-metric="'+key+'"]');
      if(element)element.textContent=metricValues[key];
    });

    const totalElement=document.querySelector('[data-analytics-metric="total"]');
    const completedElement=document.querySelector('[data-analytics-metric="completed"]');
    if(totalElement)totalElement.textContent=formatCount(total);
    if(completedElement)completedElement.textContent=formatCount(completed);

    const countElements={
      "cp-client-analytics-count-progress":active,
      "cp-client-analytics-count-completed":completed,
      "cp-client-analytics-count-review":review,
      "cp-client-analytics-donut-total":total,
      "cp-client-analytics-project-count":total+" project"+(total===1?"":"s")
    };

    Object.keys(countElements).forEach(function(id){
      const element=document.getElementById(id);
      if(element){
        element.textContent=id==="cp-client-analytics-project-count"
          ?countElements[id]
          :formatCount(countElements[id]);
      }
    });

    if(emptyState){
      emptyState.hidden=total!==0;
    }

    if(donut){
      const progressPercent=total?(active/total)*100:0;
      const completedPercent=total?(completed/total)*100:0;
      const progressEnd=progressPercent;
      const completedEnd=progressEnd+completedPercent;
      donut.style.background=total
        ?"conic-gradient(#b6ff4a 0% "+progressEnd+"%,#a78bfa "+progressEnd+"% "+completedEnd+"%,#fb923c "+completedEnd+"% 100%)"
        :"conic-gradient(#292c38 0% 100%)";
      donut.setAttribute("aria-label",
        total+" projects: "+active+" in progress, "+completed+" completed, "+review+" in review.");
    }
  }

  /*--- Update Progress Chart ---*/
  function updateProgressChart(period){
    const data=analyticsData[period]||analyticsData["30"];
    const xStart=45;
    const xEnd=680;
    const yTop=25;
    const yBottom=205;
    const chartWidth=xEnd-xStart;
    const chartHeight=yBottom-yTop;

    const points=data.trend.map(function(value,index){
      const x=xStart+(chartWidth/(data.trend.length-1))*index;
      const y=yBottom-(value/100)*chartHeight;
      return {x:x,y:y,value:value};
    });

    const linePath=points.map(function(point,index){
      return (index===0?"M":"L")+point.x.toFixed(1)+" "+point.y.toFixed(1);
    }).join(" ");

    const areaPath=linePath+" L"+xEnd+" "+yBottom+" L"+xStart+" "+yBottom+" Z";

    if(chartLine)chartLine.setAttribute("d",linePath);
    if(chartArea)chartArea.setAttribute("d",areaPath);

    if(chartPoints){
      chartPoints.replaceChildren();
      points.forEach(function(point){
        const circle=document.createElementNS("http://www.w3.org/2000/svg","circle");
        circle.setAttribute("cx",point.x);
        circle.setAttribute("cy",point.y);
        circle.setAttribute("r","4");
        circle.setAttribute("aria-label",point.value+"% progress");
        chartPoints.appendChild(circle);
      });
    }

    if(chartLabels){
      chartLabels.replaceChildren();
      points.forEach(function(point,index){
        const text=document.createElementNS("http://www.w3.org/2000/svg","text");
        text.setAttribute("x",point.x);
        text.setAttribute("y","231");
        text.setAttribute("text-anchor","middle");
        text.textContent=data.labels[index];
        chartLabels.appendChild(text);
      });
    }

    if(chartSummary){
      chartSummary.textContent=data.progress+"%";
    }

    const progressMetric=document.querySelector('[data-analytics-metric="progress"]');
    if(progressMetric){
      progressMetric.textContent=data.progress+"%";
    }

    const miniTrack=document.querySelector(".cp-client-analytics-mini-track span");
    if(miniTrack){
      miniTrack.style.width=data.progress+"%";
    }

    const chart=document.getElementById("cp-client-analytics-line-chart");
    if(chart){
      chart.setAttribute("aria-label",
        "Illustrative progress trend for the last "+period+" days. Final displayed progress: "+data.progress+" percent.");
    }
  }

  /*--- Reporting Period Change ---*/
  if(rangeSelect){
    rangeSelect.addEventListener("change",function(){
      updateProgressChart(rangeSelect.value);
    });
  }

  /*--- CSV Export ---*/
  function escapeCSV(value){
    return '"'+String(value).replace(/"/g,'""')+'"';
  }

  function exportProjects(){
    const rows=getProjectRows();
    const headers=["Project","Category","Status","Progress","Deadline","Priority"];
    const csvRows=[headers.map(escapeCSV).join(",")];

    rows.forEach(function(row){
      const cells=Array.from(row.querySelectorAll("td"));
      if(cells.length<5)return;

      const project=cells[0].querySelector("strong")?.textContent.trim()||"";
      const category=cells[0].querySelector("small")?.textContent.trim()||"";
      const status=cells[1].textContent.trim();
      const progress=cells[2].querySelector("strong")?.textContent.trim()||"";
      const deadline=cells[3].textContent.trim();
      const priority=cells[4].textContent.trim();

      csvRows.push([
        project,
        category,
        status,
        progress,
        deadline,
        priority
      ].map(escapeCSV).join(","));
    });

    const csvContent="\uFEFF"+csvRows.join("\r\n");
    const blob=new Blob([csvContent],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;
    link.download="client-project-analytics.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  if(exportButton){
    exportButton.addEventListener("click",exportProjects);
  }

  /*--- Initialize Analytics ---*/
  updateProjectStatistics();
  updateProgressChart(rangeSelect?rangeSelect.value:"30");
});
/*--- Client Analytics Initialization End ---*/
