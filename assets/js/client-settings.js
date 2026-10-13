
/*--- Client Settings Initialization ---*/
document.addEventListener("DOMContentLoaded",function(){
  /*--- Elements ---*/
  const form=document.getElementById("cp-client-settings-form");
  const resetButton=document.getElementById("cp-client-settings-reset");
  const saveStatus=document.getElementById("cp-client-settings-save-status");
  const unsavedMessage=document.getElementById("cp-client-settings-unsaved");
  const preview=document.getElementById("cp-client-settings-preview");
  const previewTheme=document.getElementById("cp-client-settings-preview-theme");
  const previewAccent=document.getElementById("cp-client-settings-preview-accent");
  const previewLayout=document.getElementById("cp-client-settings-preview-layout");
  const summaryTheme=document.getElementById("cp-client-settings-summary-theme");
  const summaryNotifications=document.getElementById("cp-client-settings-summary-notifications");
  const summaryLanguage=document.getElementById("cp-client-settings-summary-language");
  const summaryTimezone=document.getElementById("cp-client-settings-summary-timezone");
  const yearElement=document.getElementById("cp-client-settings-year");
  const storageKey="cpClientSettings";

  if(!form)return;

  /*--- Default Preferences ---*/
  const defaults={
    theme:"dark",
    accent:"lime",
    compact:false,
    reduceMotion:false,
    language:"en",
    dateFormat:"DD MMM YYYY",
    timezone:"Asia/Kolkata",
    projectUpdates:true,
    milestoneReminders:true,
    feedbackRequests:true,
    announcements:false,
    rememberDevice:false
  };

  const accentColors={
    lime:"#b6ff4a",
    violet:"#a78bfa",
    blue:"#60a5fa",
    orange:"#fb923c"
  };

  const languageNames={
    en:"English",
    ta:"Tamil",
    hi:"Hindi"
  };

  const timezoneNames={
    "Asia/Kolkata":"Asia/Kolkata",
    UTC:"UTC",
    "Asia/Dubai":"Asia/Dubai",
    "Europe/London":"Europe/London",
    "America/New_York":"America/New_York"
  };

  /*--- Read Stored Preferences ---*/
  function readSavedSettings(){
    try{
      const stored=localStorage.getItem(storageKey);
      if(!stored)return {...defaults};
      const parsed=JSON.parse(stored);
      if(!parsed||typeof parsed!=="object"||Array.isArray(parsed)){
        return {...defaults};
      }
      return {...defaults,...parsed};
    }catch(error){
      return {...defaults};
    }
  }

  /*--- Get Current Form Values ---*/
  function getFormValues(){
    const values={};
    new FormData(form).forEach(function(value,key){
      values[key]=value;
    });

    form.querySelectorAll('input[type="checkbox"]').forEach(function(input){
      values[input.name]=input.checked;
    });

    form.querySelectorAll('input[type="radio"]:checked').forEach(function(input){
      values[input.name]=input.value;
    });

    return {...defaults,...values};
  }

  /*--- Populate Settings Form ---*/
  function populateForm(settings){
    Object.keys(settings).forEach(function(key){
      const value=settings[key];
      const fields=form.querySelectorAll('[name="'+key+'"]');
      if(!fields.length)return;

      fields.forEach(function(field){
        if(field.type==="checkbox"){
          field.checked=Boolean(value);
        }else if(field.type==="radio"){
          field.checked=field.value===value;
        }else{
          field.value=value;
        }
      });
    });
  }

  /*--- Update Preview And Summary ---*/
  function updatePreview(settings){
    const accent=accentColors[settings.accent]||accentColors.lime;
    const theme=settings.theme||"dark";
    const accentName=theme==="system"?"System":theme.charAt(0).toUpperCase()+theme.slice(1);
    const selectedAccent=settings.accent||"lime";
    const selectedAccentName=selectedAccent.charAt(0).toUpperCase()+selectedAccent.slice(1);
    const enabledNotifications=[
      settings.projectUpdates,
      settings.milestoneReminders,
      settings.feedbackRequests,
      settings.announcements
    ].filter(Boolean).length;

    if(preview){
      preview.style.setProperty("--cp-client-settings-preview-accent",accent);
      preview.dataset.theme=theme;
      preview.dataset.accent=selectedAccent;
      preview.classList.toggle("cp-client-settings-preview-compact",Boolean(settings.compact));
      preview.classList.toggle("cp-client-settings-preview-light",theme==="light");
    }

    if(previewTheme)previewTheme.textContent=accentName;
    if(previewAccent)previewAccent.textContent=selectedAccentName;
    if(previewLayout)previewLayout.textContent=settings.compact?"Compact":"Comfortable";
    if(summaryTheme)summaryTheme.textContent=accentName+" / "+selectedAccentName;
    if(summaryNotifications){
      summaryNotifications.textContent=enabledNotifications+" enabled";
    }
    if(summaryLanguage){
      summaryLanguage.textContent=languageNames[settings.language]||"English";
    }
    if(summaryTimezone){
      summaryTimezone.textContent=timezoneNames[settings.timezone]||settings.timezone;
    }

    const page=document.querySelector(".cp-client-settings");
    if(page){
      page.dataset.accent=selectedAccent;
      page.dataset.compact=String(Boolean(settings.compact));
      page.dataset.reduceMotion=String(Boolean(settings.reduceMotion));
    }
  }

  /*--- Status Messages ---*/
  function setStatus(saved){
    if(saveStatus){
      saveStatus.classList.toggle("is-unsaved",!saved);
      saveStatus.innerHTML=saved
        ?'<i class="bi bi-check-circle"></i> All changes saved'
        :'<i class="bi bi-exclamation-circle"></i> Unsaved changes';
    }

    if(unsavedMessage){
      unsavedMessage.textContent=saved
        ?"Your preferences are up to date."
        :"You have unsaved preference changes.";
    }
  }

  /*--- Compare Current And Saved Settings ---*/
  function settingsAreEqual(first,second){
    return Object.keys(defaults).every(function(key){
      return first[key]===second[key];
    });
  }

  /*--- Save Preferences ---*/
  function saveSettings(settings){
    try{
      localStorage.setItem(storageKey,JSON.stringify(settings));
      setStatus(true);
      return true;
    }catch(error){
      if(saveStatus){
        saveStatus.classList.add("is-unsaved");
        saveStatus.innerHTML='<i class="bi bi-exclamation-triangle"></i> Unable to save';
      }
      if(unsavedMessage){
        unsavedMessage.textContent="Browser storage is unavailable. Your changes may not persist.";
      }
      return false;
    }
  }

  /*--- Apply Stored Preferences ---*/
  let savedSettings=readSavedSettings();
  populateForm(savedSettings);
  updatePreview(savedSettings);
  setStatus(true);

  if(yearElement){
    yearElement.textContent=new Date().getFullYear();
  }

  /*--- Live Preference Preview ---*/
  form.addEventListener("input",function(){
    const currentSettings=getFormValues();
    updatePreview(currentSettings);
    setStatus(settingsAreEqual(currentSettings,savedSettings));
  });

  form.addEventListener("change",function(){
    const currentSettings=getFormValues();
    updatePreview(currentSettings);
    setStatus(settingsAreEqual(currentSettings,savedSettings));
  });

  /*--- Save Changes ---*/
  form.addEventListener("submit",function(event){
    event.preventDefault();
    const currentSettings=getFormValues();

    if(saveSettings(currentSettings)){
      savedSettings={...currentSettings};
      updatePreview(savedSettings);
    }
  });

  /*--- Reset Default Preferences ---*/
  if(resetButton){
    resetButton.addEventListener("click",function(){
      populateForm(defaults);
      const currentSettings={...defaults};
      updatePreview(currentSettings);
      setStatus(!localStorage.getItem(storageKey)||settingsAreEqual(currentSettings,savedSettings));

      if(unsavedMessage){
        unsavedMessage.textContent="Default preferences selected. Save changes to apply them.";
      }
    });
  }
});
/*--- Client Settings Initialization End ---*/
