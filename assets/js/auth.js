
/*--- Login Page Initialization ---*/
document.addEventListener("DOMContentLoaded",function(){
  const form=document.getElementById("cp-auth-login-form");
  const emailInput=document.getElementById("cp-auth-login-email");
  const passwordInput=document.getElementById("cp-auth-login-password");
  const passwordToggle=document.getElementById("cp-auth-login-password-toggle");
  const rememberCheckbox=document.getElementById("cp-auth-login-remember");
  const errorMessage=document.getElementById("cp-auth-login-error");
  const yearElement=document.getElementById("cp-auth-login-year");
  if(yearElement)yearElement.textContent=new Date().getFullYear();
  if(!form||!emailInput||!passwordInput)return;
  /*--- Restore Remembered Email ---*/
  const rememberedEmail=localStorage.getItem("cpRememberedEmail");
  if(rememberedEmail){
    emailInput.value=rememberedEmail;
    rememberCheckbox.checked=true;
  }
  /*--- Password Visibility Toggle ---*/
  if(passwordToggle){
    passwordToggle.addEventListener("click",function(){
      const showPassword=passwordInput.type==="password";
      passwordInput.type=showPassword?"text":"password";
      passwordToggle.innerHTML=showPassword?'<i class="bi bi-eye-slash"></i>':'<i class="bi bi-eye"></i>';
      passwordToggle.setAttribute("aria-label",showPassword?"Hide password":"Show password");
      passwordToggle.setAttribute("aria-pressed",String(showPassword));
    });
  }
  /*--- Clear Validation Message While Editing ---*/
  [emailInput,passwordInput].forEach(function(input){
    input.addEventListener("input",function(){
      errorMessage.textContent="";
      input.setCustomValidity("");
    });
  });
  /*--- Login Form Submission ---*/
  form.addEventListener("submit",function(event){
    event.preventDefault();
    errorMessage.textContent="";
    emailInput.value=emailInput.value.trim();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    const email=emailInput.value;
    const password=passwordInput.value;
    const selectedRole=form.querySelector('input[name="accountRole"]:checked');
    if(!selectedRole){
      errorMessage.textContent="Please select Admin or Client.";
      return;
    }
    if(!emailInput.validity.valid){
      emailInput.setCustomValidity("Please enter a valid email address.");
      emailInput.reportValidity();
      return;
    }
    if(!password){
      errorMessage.textContent="Please enter your password.";
      passwordInput.focus();
      return;
    }
    const role=selectedRole.value;
    /*--- Store Login Details For Dashboard ---*/
    try{
      sessionStorage.setItem("cpLoginEmail",email);
      sessionStorage.setItem("cpLoginRole",role);
      localStorage.removeItem("cpLoginEmail");
      localStorage.removeItem("cpLoginRole");
      if(rememberCheckbox.checked){
        localStorage.setItem("cpLoginEmail",email);
        localStorage.setItem("cpLoginRole",role);
        localStorage.setItem("cpRememberedEmail",email);
      }else{
        localStorage.removeItem("cpRememberedEmail");
      }
    }catch(error){
      errorMessage.textContent="Unable to save your session. Please check your browser settings.";
      return;
    }
    /*--- Redirect According To Selected Role ---*/
    const dashboard=role==="admin"?"admin-dashboard.html":"client-dashboard.html";
    window.location.href=dashboard;
  });
});
/*--- Login Page Initialization End ---*/



/*--- Register Page Initialization ---*/
document.addEventListener("DOMContentLoaded",function(){
  const form=document.getElementById("cp-auth-register-form");
  const nameInput=document.getElementById("cp-auth-register-name");
  const phoneInput=document.getElementById("cp-auth-register-phone");
  const emailInput=document.getElementById("cp-auth-register-email");
  const passwordInput=document.getElementById("cp-auth-register-password");
  const confirmInput=document.getElementById("cp-auth-register-confirm");
  const errorMessage=document.getElementById("cp-auth-register-error");
  const yearElement=document.getElementById("cp-auth-register-year");
  if(yearElement)yearElement.textContent=new Date().getFullYear();
  if(!form)return;
  /*--- Full Name Validation ---*/
  nameInput.addEventListener("input",function(){
    nameInput.value=nameInput.value.replace(/[^A-Za-z ]/g,"");
    nameInput.setCustomValidity("");
    errorMessage.textContent="";
  });
  /*--- Phone Number Validation ---*/
  phoneInput.addEventListener("input",function(){
    phoneInput.value=phoneInput.value.replace(/\D/g,"").slice(0,10);
    phoneInput.setCustomValidity("");
    errorMessage.textContent="";
  });
  /*--- Password Visibility Toggle ---*/
  document.querySelectorAll("[data-password-toggle]").forEach(function(toggle){
    toggle.addEventListener("click",function(){
      const input=document.getElementById(toggle.dataset.passwordToggle);
      if(!input)return;
      const show=input.type==="password";
      input.type=show?"text":"password";
      toggle.innerHTML=show?'<i class="bi bi-eye-slash"></i>':'<i class="bi bi-eye"></i>';
      toggle.setAttribute("aria-label",show?"Hide password":"Show password");
      toggle.setAttribute("aria-pressed",String(show));
    });
  });
  /*--- Live Password Requirements ---*/
  const passwordRules={
    length:function(value){return value.length>=8;},
    uppercase:function(value){return /[A-Z]/.test(value);},
    lowercase:function(value){return /[a-z]/.test(value);},
    number:function(value){return /[0-9]/.test(value);},
    special:function(value){return /[^A-Za-z0-9]/.test(value);}
  };
  function updatePasswordRules(){
    const value=passwordInput.value;
    Object.keys(passwordRules).forEach(function(rule){
      const element=document.querySelector('[data-rule="'+rule+'"]');
      if(!element)return;
      const valid=passwordRules[rule](value);
      element.classList.toggle("cp-auth-register-rule-valid",valid);
      element.querySelector("i").className=valid?"bi bi-check-circle-fill":"bi bi-circle";
    });
    passwordInput.setCustomValidity(Object.values(passwordRules).every(function(check){return check(value);})?"":"Password must contain at least 8 characters, an uppercase letter, a lowercase letter, a number, and a special character.");
    if(confirmInput.value)validateConfirmPassword(false);
  }
  passwordInput.addEventListener("input",function(){
    errorMessage.textContent="";
    updatePasswordRules();
  });
  /*--- Confirm Password Validation ---*/
  function validateConfirmPassword(showMessage){
    const matches=passwordInput.value===confirmInput.value;
    confirmInput.setCustomValidity(matches?"":"Passwords do not match.");
    if(showMessage&&!matches){
      errorMessage.textContent="Your passwords do not match.";
    }else if(matches){
      errorMessage.textContent="";
    }
    return matches;
  }
  confirmInput.addEventListener("input",function(){
    errorMessage.textContent="";
    validateConfirmPassword(false);
  });
  /*--- Clear Field Validation Messages ---*/
  [nameInput,phoneInput,emailInput].forEach(function(input){
    input.addEventListener("input",function(){
      input.setCustomValidity("");
      errorMessage.textContent="";
    });
  });
  /*--- Register Form Submission ---*/
  form.addEventListener("submit",function(event){
    event.preventDefault();
    errorMessage.textContent="";
    nameInput.value=nameInput.value.trim().replace(/\s+/g," ");
    emailInput.value=emailInput.value.trim();
    const selectedRole=form.querySelector('input[name="accountRole"]:checked');
    if(!selectedRole){
      errorMessage.textContent="Please select Admin or Client.";
      form.querySelectorAll('input[name="accountRole"]').forEach(function(input){input.setCustomValidity("Please select an account type.");});
      form.querySelector('input[name="accountRole"]').reportValidity();
      return;
    }
    form.querySelectorAll('input[name="accountRole"]').forEach(function(input){input.setCustomValidity("");});
    if(!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(nameInput.value)){
      nameInput.setCustomValidity("Enter your name using letters and spaces only.");
      nameInput.reportValidity();
      return;
    }
    if(!/^[0-9]{10}$/.test(phoneInput.value)){
      phoneInput.setCustomValidity("Enter exactly 10 digits.");
      phoneInput.reportValidity();
      return;
    }
    if(!emailInput.validity.valid){
      emailInput.setCustomValidity("Enter a valid email address.");
      emailInput.reportValidity();
      return;
    }
    updatePasswordRules();
    if(!passwordInput.validity.valid){
      passwordInput.reportValidity();
      return;
    }
    if(!validateConfirmPassword(true)){
      confirmInput.reportValidity();
      return;
    }
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    /*--- Save Registration Profile Details ---*/
    const profile={
      name:nameInput.value,
      phone:phoneInput.value,
      email:emailInput.value,
      role:selectedRole.value
    };
    try{
      localStorage.setItem("cpRegisteredName",profile.name);
      localStorage.setItem("cpRegisteredPhone",profile.phone);
      localStorage.setItem("cpRegisteredEmail",profile.email);
      localStorage.setItem("cpRegisteredRole",profile.role);
      sessionStorage.setItem("cpRegisteredName",profile.name);
      sessionStorage.setItem("cpRegisteredPhone",profile.phone);
      sessionStorage.setItem("cpRegisteredEmail",profile.email);
      sessionStorage.setItem("cpRegisteredRole",profile.role);
    }catch(error){
      errorMessage.textContent="Unable to save your details. Please check your browser settings.";
      return;
    }
    /*--- Redirect To Login Page ---*/
    window.location.href="login.html";
  });
  updatePasswordRules();
});
/*--- Register Page Initialization End ---*/
