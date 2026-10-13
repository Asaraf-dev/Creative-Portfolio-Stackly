
/*--- Admin Settings Initialization ---*/
document.addEventListener("DOMContentLoaded",function(){
    const form=document.getElementById("cp-admin-settings-form");
    const content=document.querySelector(".cp-admin-settings-content");
    const feedback=document.getElementById("cp-admin-settings-feedback");
    const unsavedIndicator=document.getElementById("cp-admin-settings-unsaved");
    const saveButton=document.getElementById("cp-admin-settings-save");
    const resetButton=document.getElementById("cp-admin-settings-reset");
    const workspaceName=document.getElementById("cp-admin-settings-workspace-name");
    const workspaceTagline=document.getElementById("cp-admin-settings-workspace-tagline");
    const previewName=document.getElementById("cp-admin-settings-preview-name");
    const previewTagline=document.getElementById("cp-admin-settings-preview-tagline");
    const sessionEmail=document.getElementById("cp-admin-settings-session-email");
    const sessionRole=document.getElementById("cp-admin-settings-session-role");
    const yearElement=document.getElementById("cp-admin-settings-year");
    const changePasswordButton=document.getElementById("cp-admin-settings-change-password");
    const logoutButton=document.getElementById("cp-admin-settings-logout");
    const storageKey="cpAdminSettings";
    let savedSettings={};
    let feedbackTimer;
    let isDirty=false;
    const defaults={
        theme:"dark",
        accent:"lime",
        compact:false,
        reduceMotion:false,
        language:"en",
        dateFormat:"DD MMM YYYY",
        timezone:"Asia/Kolkata",
        startPage:"admin-dashboard.html",
        dashboardNotifications:true,
        emailNotifications:false,
        enquiryNotifications:true,
        weeklySummary:false,
        workspaceName:"Creative Portfolio",
        workspaceTagline:"Your creative space"
    };
    const accentColors={
        lime:"#b6ff4a",
        violet:"#a78bfa",
        blue:"#63b3ff",
        orange:"#ffb36b"
    };
    /*--- Storage Helpers ---*/
    function readSettings(){
        try{
            const raw=localStorage.getItem(storageKey);
            return raw?JSON.parse(raw):{};
        }catch(error){
            return{};
        }
    }
    function saveSettings(settings){
        try{
            localStorage.setItem(storageKey,JSON.stringify(settings));
            return true;
        }catch(error){
            return false;
        }
    }
    function getStorageValue(key){
        try{
            return sessionStorage.getItem(key)||localStorage.getItem(key)||"";
        }catch(error){
            return"";
        }
    }
    /*--- Form Values ---*/
    function readForm(){
        const values={};
        new FormData(form).forEach(function(value,key){
            values[key]=value;
        });
        form.querySelectorAll('input[type="checkbox"]').forEach(function(input){
            values[input.name]=input.checked;
        });
        const theme=form.querySelector('input[name="theme"]:checked');
        const accent=form.querySelector('input[name="accent"]:checked');
        values.theme=theme?theme.value:defaults.theme;
        values.accent=accent?accent.value:defaults.accent;
        return Object.assign({},defaults,values);
    }
    function applyForm(settings){
        Object.keys(settings).forEach(function(key){
            const value=settings[key];
            const radio=form.querySelector('input[type="radio"][name="'+key+'"][value="'+value+'"]');
            if(radio)radio.checked=true;
            const field=form.elements.namedItem(key);
            if(!field)return;
            if(field.type==="checkbox")field.checked=Boolean(value);
            else if(field.type!=="radio")field.value=value;
        });
        updateWorkspacePreview();
        applyVisualSettings();
    }
    /*--- Feedback Message ---*/
    function showFeedback(message,isError){
        if(!feedback)return;
        window.clearTimeout(feedbackTimer);
        feedback.textContent=message;
        feedback.classList.toggle("is-error",Boolean(isError));
        feedback.hidden=false;
        feedbackTimer=window.setTimeout(function(){
            feedback.hidden=true;
        },4000);
    }
    /*--- Unsaved Changes Indicator ---*/
    function updateDirtyState(){
        isDirty=true;
        if(unsavedIndicator)unsavedIndicator.hidden=false;
    }
    function clearDirtyState(){
        isDirty=false;
        if(unsavedIndicator)unsavedIndicator.hidden=true;
    }
    /*--- Workspace Preview ---*/
    function updateWorkspacePreview(){
        const name=workspaceName.value.trim()||defaults.workspaceName;
        const tagline=workspaceTagline.value.trim()||defaults.workspaceTagline;
        if(previewName)previewName.textContent=name;
        if(previewTagline)previewTagline.textContent=tagline;
    }
    /*--- Apply Appearance Settings ---*/
    function applyVisualSettings(){
        const settings=readForm();
        const theme=settings.theme;
        const accent=accentColors[settings.accent]||accentColors.lime;
        const systemLight=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches;
        const effectiveTheme=theme==="system"?(systemLight?"light":"dark"):theme;
        if(content){
            content.dataset.theme=effectiveTheme;
            content.dataset.compact=String(settings.compact);
            content.dataset.reduceMotion=String(settings.reduceMotion);
            content.style.setProperty("--cp-settings-accent",accent);
            content.style.setProperty("--cp-settings-accent-rgb",accent);
        }
        document.documentElement.style.setProperty("--cp-admin-settings-accent",accent);
        document.documentElement.style.setProperty("--cp-admin-settings-accent-rgb",accent);
        if(content){
            content.querySelectorAll(".cp-admin-settings-kicker,.cp-admin-settings-status>span,.cp-admin-settings-preview-icon,.cp-admin-settings-preview-dot").forEach(function(element){
                if(element.matches(".cp-admin-settings-status>span,.cp-admin-settings-preview-dot"))element.style.background=accent;
                else if(element.matches(".cp-admin-settings-preview-icon"))element.style.color=accent;
                else element.style.color=accent;
            });
        }
    }
    /*--- Current Session Details ---*/
    function renderSession(){
        const email=getStorageValue("cpLoginEmail")||getStorageValue("cpRegisteredEmail")||getStorageValue("cpRememberedEmail")||"Email not available";
        const role=(getStorageValue("cpLoginRole")||getStorageValue("cpRegisteredRole")||"admin").toLowerCase();
        if(sessionEmail)sessionEmail.textContent=email;
        if(sessionRole)sessionRole.textContent=role==="admin"?"Administrator account":"Client account";
        if(yearElement)yearElement.textContent=new Date().getFullYear();
    }
    /*--- Settings Change Events ---*/
    form.addEventListener("input",function(event){
        updateDirtyState();
        updateWorkspacePreview();
        if(event.target.name==="theme"||event.target.name==="accent"||event.target.name==="compact"||event.target.name==="reduceMotion"){
            applyVisualSettings();
        }
    });
    form.addEventListener("change",function(){
        updateDirtyState();
        updateWorkspacePreview();
        applyVisualSettings();
    });
    /*--- Save Settings ---*/
    form.addEventListener("submit",function(event){
        event.preventDefault();
        const settings=readForm();
        settings.updatedAt=new Date().toISOString();
        settings.updatedBy=getStorageValue("cpLoginEmail")||"admin";
        if(!settings.workspaceName.trim()){
            workspaceName.setCustomValidity("Enter a workspace name.");
            workspaceName.reportValidity();
            workspaceName.setCustomValidity("");
            workspaceName.focus();
            return;
        }
        settings.workspaceName=settings.workspaceName.trim();
        settings.workspaceTagline=settings.workspaceTagline.trim();
        saveButton.disabled=true;
        saveButton.innerHTML='<i class="bi bi-arrow-repeat"></i> Saving...';
        if(!saveSettings(settings)){
            saveButton.disabled=false;
            saveButton.innerHTML='<i class="bi bi-check2-circle"></i> Save settings';
            showFeedback("Unable to save settings. Check your browser storage availability.",true);
            return;
        }
        savedSettings=Object.assign({},settings);
        clearDirtyState();
        applyVisualSettings();
        saveButton.disabled=false;
        saveButton.innerHTML='<i class="bi bi-check2-circle"></i> Save settings';
        showFeedback("Your settings have been saved successfully.",false);
    });
    /*--- Reset Settings To Defaults ---*/
    if(resetButton){
        resetButton.addEventListener("click",function(){
            const confirmed=window.confirm("Reset all settings to their default values?");
            if(!confirmed)return;
            const resetValues=Object.assign({},defaults,{updatedAt:new Date().toISOString()});
            if(!saveSettings(resetValues)){
                showFeedback("Unable to reset settings. Check your browser storage.",true);
                return;
            }
            savedSettings=Object.assign({},resetValues);
            applyForm(resetValues);
            clearDirtyState();
            showFeedback("Settings have been reset to their defaults.",false);
        });
    }
    /*--- Password Management Navigation ---*/
    if(changePasswordButton){
        changePasswordButton.addEventListener("click",function(){
            window.location.href="404.html";
        });
    }
    /*--- Logout Confirmation ---*/
    if(logoutButton){
        logoutButton.addEventListener("click",function(){
            const confirmed=window.confirm("Are you sure you want to log out?");
            if(!confirmed)return;
            try{
                sessionStorage.removeItem("cpLoginEmail");
                sessionStorage.removeItem("cpLoginRole");
                localStorage.removeItem("cpLoginEmail");
                localStorage.removeItem("cpLoginRole");
            }catch(error){
                showFeedback("Unable to clear your session storage.",true);
                return;
            }
            window.location.href="login.html";
        });
    }
    /*--- Settings Navigation Active State ---*/
    document.querySelectorAll(".cp-admin-settings-nav-link").forEach(function(link){
        link.addEventListener("click",function(){
            document.querySelectorAll(".cp-admin-settings-nav-link").forEach(function(item){
                item.classList.remove("is-active");
            });
            link.classList.add("is-active");
        });
    });
    /*--- Warn About Unsaved Changes ---*/
    window.addEventListener("beforeunload",function(event){
        if(!isDirty)return;
        event.preventDefault();
        event.returnValue="";
    });
    /*--- System Theme Updates ---*/
    if(window.matchMedia){
        const systemTheme=window.matchMedia("(prefers-color-scheme: light)");
        systemTheme.addEventListener("change",function(){
            if(readForm().theme==="system")applyVisualSettings();
        });
    }
    /*--- Initial Settings Load ---*/
    const storedSettings=readSettings();
    savedSettings=Object.assign({},defaults,storedSettings);
    applyForm(savedSettings);
    renderSession();
    clearDirtyState();
});
/*--- Admin Settings Initialization End ---*/
