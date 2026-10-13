
/*--- Admin Analytics Initialization ---*/
document.addEventListener("DOMContentLoaded",function(){
    const rangeButtons=document.querySelectorAll("[data-analytics-range]");
    const refreshButton=document.getElementById("cp-admin-analytics-refresh");
    const exportButton=document.getElementById("cp-admin-analytics-export");
    const chartLine=document.getElementById("cp-admin-analytics-chart-line");
    const chartArea=document.getElementById("cp-admin-analytics-chart-area-path");
    const chartPoints=document.getElementById("cp-admin-analytics-chart-points");
    const xAxis=document.getElementById("cp-admin-analytics-x-axis");
    const yearElement=document.getElementById("cp-admin-analytics-year");
    const chartTotal=document.getElementById("cp-admin-analytics-chart-total");
    const chartGrowth=document.getElementById("cp-admin-analytics-chart-growth");
    const visitorsElement=document.getElementById("cp-admin-analytics-visitors");
    const viewsElement=document.getElementById("cp-admin-analytics-views");
    const conversionElement=document.getElementById("cp-admin-analytics-conversion");
    const durationElement=document.getElementById("cp-admin-analytics-duration");
    const sourceTotal=document.getElementById("cp-admin-analytics-source-total");
    const sourceDonut=document.getElementById("cp-admin-analytics-source-donut");
    let currentRange=30;
    const analyticsData={
        7:{
            visitors:5820,
            views:15860,
            conversion:4.62,
            duration:"3m 28s",
            growth:8.4,
            chart:[520,680,610,840,760,1050,1360],
            labels:["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"]
        },
        30:{
            visitors:24680,
            views:68420,
            conversion:4.86,
            duration:"3m 42s",
            growth:12.8,
            chart:[820,1120,960,1480,1320,1850,1620,2180,1950,2460,2280],
            labels:["Day 1","Day 5","Day 10","Day 15","Day 20","Day 25","Day 30"]
        },
        90:{
            visitors:74820,
            views:206540,
            conversion:5.12,
            duration:"4m 06s",
            growth:21.6,
            chart:[680,920,850,1180,1090,1420,1330,1760,1640,2050,2380],
            labels:["Day 1","Day 15","Day 30","Day 45","Day 60","Day 75","Day 90"]
        }
    };
    /*--- Number Formatting ---*/
    function formatNumber(value){
        return new Intl.NumberFormat("en-IN").format(value);
    }
    function formatCompact(value){
        return value>=1000?(value/1000).toFixed(1)+"k":String(value);
    }
    /*--- Traffic Chart Rendering ---*/
    function renderChart(values){
        if(!chartLine||!chartArea||!chartPoints)return;
        const width=700;
        const height=220;
        const topPadding=12;
        const bottomPadding=12;
        const maxValue=Math.max(...values)*1.12;
        const usableHeight=height-topPadding-bottomPadding;
        const coordinates=values.map(function(value,index){
            return{
                x:values.length===1?width/2:index*width/(values.length-1),
                y:height-bottomPadding-(value/maxValue)*usableHeight
            };
        });
        const path=coordinates.map(function(point,index){
            return(index===0?"M":"L")+point.x.toFixed(1)+" "+point.y.toFixed(1);
        }).join(" ");
        chartLine.setAttribute("d",path);
        chartArea.setAttribute("d",path+" L"+width+" "+height+" L0 "+height+" Z");
        chartPoints.replaceChildren();
        coordinates.forEach(function(point,index){
            if(index!==coordinates.length-1&&index%Math.max(1,Math.floor(coordinates.length/5))!==0)return;
            const circle=document.createElementNS("http://www.w3.org/2000/svg","circle");
            circle.setAttribute("cx",point.x);
            circle.setAttribute("cy",point.y);
            circle.setAttribute("r",index===coordinates.length-1?"5":"3.5");
            circle.setAttribute("aria-hidden","true");
            chartPoints.appendChild(circle);
        });
    }
    /*--- Chart Axis Labels ---*/
    function renderLabels(labels){
        if(!xAxis)return;
        xAxis.replaceChildren();
        labels.forEach(function(label){
            const span=document.createElement("span");
            span.textContent=label;
            xAxis.appendChild(span);
        });
    }
    /*--- Analytics Metric Updates ---*/
    function updateAnalytics(range){
        const data=analyticsData[range];
        if(!data)return;
        currentRange=range;
        rangeButtons.forEach(function(button){
            const isActive=Number(button.dataset.analyticsRange)===range;
            button.classList.toggle("is-active",isActive);
            button.setAttribute("aria-pressed",String(isActive));
        });
        if(visitorsElement)visitorsElement.textContent=formatNumber(data.visitors);
        if(viewsElement)viewsElement.textContent=formatNumber(data.views);
        if(conversionElement)conversionElement.textContent=data.conversion.toFixed(2)+"%";
        if(durationElement)durationElement.textContent=data.duration;
        if(chartTotal)chartTotal.textContent=formatNumber(data.visitors);
        if(chartGrowth)chartGrowth.textContent="+"+data.growth.toFixed(1)+"%";
        if(sourceTotal)sourceTotal.textContent=formatCompact(data.visitors);
        const changes={
            visitors:data.growth,
            views:data.growth+5.6,
            conversion:data.growth/6,
            duration:data.growth/1.5
        };
        document.querySelectorAll("[data-analytics-change]").forEach(function(element){
            const key=element.dataset.analyticsChange;
            if(changes[key]!==undefined)element.textContent=changes[key].toFixed(1)+"%";
        });
        if(sourceDonut){
            const search=42;
            const direct=28;
            const social=18;
            sourceDonut.setAttribute("aria-label","Illustrative traffic sources: organic search "+search+" percent, direct "+direct+" percent, social media "+social+" percent, referral 12 percent");
        }
        renderChart(data.chart);
        renderLabels(data.labels);
    }
    /*--- Reporting Period Controls ---*/
    rangeButtons.forEach(function(button){
        button.addEventListener("click",function(){
            updateAnalytics(Number(button.dataset.analyticsRange));
        });
    });
    /*--- Refresh Animation ---*/
    if(refreshButton){
        refreshButton.addEventListener("click",function(){
            if(refreshButton.disabled)return;
            refreshButton.disabled=true;
            refreshButton.classList.add("is-refreshing");
            updateAnalytics(currentRange);
            window.setTimeout(function(){
                refreshButton.disabled=false;
                refreshButton.classList.remove("is-refreshing");
            },500);
        });
    }
    /*--- Export Analytics CSV ---*/
    if(exportButton){
        exportButton.addEventListener("click",function(){
            const data=analyticsData[currentRange];
            const rows=[
                ["Creative Portfolio Analytics Report"],
                ["Reporting period",currentRange+" days"],
                ["Data type","Illustrative demo data"],
                ["Metric","Value"],
                ["Total visitors",data.visitors],
                ["Page views",data.views],
                ["Conversion rate",data.conversion.toFixed(2)+"%"],
                ["Average session duration",data.duration],
                ["Visitor growth",data.growth.toFixed(1)+"%"],
                [],
                ["Chart point","Illustrative visitors"]
            ];
            data.chart.forEach(function(value,index){
                rows.push(["Point "+(index+1),value]);
            });
            const csv=rows.map(function(row){
                return row.map(function(value){
                    const text=String(value??"");
                    return'"'+text.replace(/"/g,'""')+'"';
                }).join(",");
            }).join("\r\n");
            const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
            const url=URL.createObjectURL(blob);
            const link=document.createElement("a");
            link.href=url;
            link.download="creative-portfolio-analytics-"+currentRange+"-days.csv";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(function(){URL.revokeObjectURL(url);},1000);
        });
    }
    /*--- Analytics Footer Year ---*/
    if(yearElement)yearElement.textContent=new Date().getFullYear();
    /*--- Initial Analytics Render ---*/
    updateAnalytics(currentRange);
});
/*--- Admin Analytics Initialization End ---*/
