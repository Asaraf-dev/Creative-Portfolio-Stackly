
/*--- Admin Profile Initialization ---*/
document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById("cp-admin-profile-form");
    const nameInput = document.getElementById("cp-admin-profile-name");
    const emailInput = document.getElementById("cp-admin-profile-email");
    const phoneInput = document.getElementById("cp-admin-profile-phone");
    const photoInput = document.getElementById("cp-admin-profile-photo-input");
    const photoElement = document.getElementById("cp-admin-profile-photo");
    const editButton = document.getElementById("cp-admin-profile-edit-btn");
    const cancelButton = document.getElementById("cp-admin-profile-cancel-btn");
    const saveButton = document.getElementById("cp-admin-profile-save-btn");
    const actionsElement = document.getElementById("cp-admin-profile-form-actions");
    const feedbackElement = document.getElementById("cp-admin-profile-feedback");
    const nameError = document.getElementById("cp-admin-profile-name-error");
    const phoneError = document.getElementById("cp-admin-profile-phone-error");
    const updatedElement = document.getElementById("cp-admin-profile-updated");
    const yearElement = document.getElementById("cp-admin-profile-year");
    const email = sessionStorage.getItem("cpLoginEmail") || localStorage.getItem("cpLoginEmail");
    const currentPage = window.location.pathname.split("/").pop().toLowerCase();
    if(currentPage=="admin-profile.html"){
    const defaultPhoto = "assets/images/profile-1.webp";}
    else{const defaultPhoto = "assets/images/profile-2.webp";}
    let originalProfile = { name: "", email: "", phone: "" };
    let selectedPhotoData = "";
    let originalPhotoData = "";
    let editing = false;
    let feedbackTimeout;
    /*--- Storage Helpers ---*/
    function getStoredValue(key) {
        try {
            return sessionStorage.getItem(key) || localStorage.getItem(key) || "";
        } catch (error) {
            return "";
        }
    }
    function setStoredValue(key, value) {
        try {
            localStorage.setItem(key, value);
            sessionStorage.setItem(key, value);
            return true;
        } catch (error) {
            return false;
        }
    }
    function getCurrentProfile() {
        const registeredName = getStoredValue("cpRegisteredName");
        const registeredPhone = getStoredValue("cpRegisteredPhone");
        const registeredEmail = getStoredValue("cpRegisteredEmail");
        const registeredRole = getStoredValue("cpRegisteredRole");
        const loginEmail = getStoredValue("cpLoginEmail");
        const loginRole = getStoredValue("cpLoginRole");
        return {
            name: registeredName,
            phone: registeredPhone,
            email: registeredEmail || loginEmail,
            role: registeredRole || loginRole || "admin"
        };
    }
    /*--- Feedback Messages ---*/
    function showFeedback(message, isError) {
        if (!feedbackElement) return;
        window.clearTimeout(feedbackTimeout);
        feedbackElement.textContent = message;
        feedbackElement.classList.toggle("is-error", Boolean(isError));
        feedbackElement.hidden = false;
        feedbackTimeout = window.setTimeout(function () {
            feedbackElement.hidden = true;
        }, 4500);
    }
    /*--- Profile Photo Loading ---*/
    function loadProfilePhoto() {
        const savedPhoto = getStoredValue("cpAdminProfilePhoto");
        selectedPhotoData = savedPhoto;
        originalPhotoData = savedPhoto;
        if (photoElement) {
            photoElement.src = savedPhoto || defaultPhoto;
            photoElement.onerror = function () {
                photoElement.onerror = null;
                photoElement.src = defaultPhoto;
            };
        }
    }
    /*--- Profile Information Display ---*/
    function renderProfile() {
        const profile = getCurrentProfile();
        if (nameInput) nameInput.value = profile.name;
        if (emailInput) emailInput.value = email;
        if (phoneInput) phoneInput.value = profile.phone;
        const displayName = profile.name || "Admin User";
        const displayEmail = profile.email || "Email not available";
        const displayPhone = profile.phone || "Not provided";
        const displayRole = profile.role.toLowerCase() === "admin" ? "Administrator" : "Client";
        const nameDisplay = document.getElementById("cp-admin-profile-display-name");
        const emailDisplay = document.getElementById("cp-admin-profile-display-email");
        const roleInput = document.getElementById("cp-admin-profile-role");
        const roleSummary = document.getElementById("cp-admin-profile-summary-role");
        const emailSummary = document.getElementById("cp-admin-profile-summary-email");
        const phoneSummary = document.getElementById("cp-admin-profile-summary-phone");
        if (nameDisplay) nameDisplay.textContent = displayName;
        if (emailDisplay) emailDisplay.textContent = email;
        if (roleInput) roleInput.value = displayRole;
        if (roleSummary) roleSummary.textContent = displayRole;
        if (emailSummary) emailSummary.textContent = email;
        if (phoneSummary) phoneSummary.textContent = displayPhone;
        if (yearElement) yearElement.textContent = new Date().getFullYear();
        /*--- Synchronize Shared Dashboard Profile ---*/
        document.querySelectorAll("[data-user-name]").forEach(function (element) {
            element.textContent = profile.name || "Welcome back";
        });
        document.querySelectorAll("[data-user-email]").forEach(function (element) {
            element.textContent = email;
        });
        document.querySelectorAll("[data-profile-image]").forEach(function (image) {
            image.src = selectedPhotoData || defaultPhoto;
        });
    }
    /*--- Last Updated Date ---*/
    function renderUpdatedDate() {
        if (!updatedElement) return;
        const savedDate = getStoredValue("cpAdminProfileUpdated");
        if (savedDate) {
            const parsedDate = new Date(savedDate);
            updatedElement.textContent = Number.isNaN(parsedDate.getTime()) ? "Not available" : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(parsedDate);
        } else {
            updatedElement.textContent = "Not recorded";
        }
    }
    /*--- Edit Mode Controls ---*/
    function setEditing(enabled) {
        editing = enabled;
        if (nameInput) nameInput.disabled = !enabled;
        if (phoneInput) phoneInput.disabled = !enabled;
        if (actionsElement) actionsElement.hidden = !enabled;
        if (editButton) editButton.hidden = enabled;
        if (enabled && nameInput) nameInput.focus();
    }
    function clearErrors() {
        if (nameError) nameError.textContent = "";
        if (phoneError) phoneError.textContent = "";
        if (nameInput) nameInput.setCustomValidity("");
        if (phoneInput) phoneInput.setCustomValidity("");
    }
    function restoreOriginalProfile() {
        if (nameInput) nameInput.value = originalProfile.name;
        if (phoneInput) phoneInput.value = originalProfile.phone;
        selectedPhotoData = originalPhotoData;
        if (photoElement) photoElement.src = originalPhotoData || defaultPhoto;
        if (photoInput) photoInput.value = "";
        clearErrors();
        setEditing(false);
    }
    /*--- Enter Profile Edit Mode ---*/
    if (editButton) {
        editButton.addEventListener("click", function () {
            originalProfile = {
                name: nameInput ? nameInput.value : "",
                email: emailInput ? emailInput.value : "",
                phone: phoneInput ? phoneInput.value : ""
            };
            originalPhotoData = selectedPhotoData;
            clearErrors();
            setEditing(true);
        });
    }
    /*--- Cancel Profile Editing ---*/
    if (cancelButton) {
        cancelButton.addEventListener("click", function () {
            restoreOriginalProfile();
            showFeedback("Your changes were cancelled.", false);
        });
    }
    /*--- Profile Field Validation ---*/
    if (nameInput) {
        nameInput.addEventListener("input", function () {
            if (nameError) nameError.textContent = "";
            nameInput.setCustomValidity("");
        });
    }
    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
            if (phoneError) phoneError.textContent = "";
            phoneInput.setCustomValidity("");
        });
    }
    /*--- Save Profile Changes ---*/
    if (profileForm) {
        profileForm.addEventListener("submit", function (event) {
            event.preventDefault();
            if (!editing) return;
            clearErrors();
            const name = nameInput.value.trim().replace(/\s+/g, " ");
            const phone = phoneInput.value.trim();
            let valid = true;
            if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name)) {
                const message = "Enter a valid name using letters and spaces only.";
                if (nameError) nameError.textContent = message;
                nameInput.setCustomValidity(message);
                valid = false;
            }
            if (!/^[0-9]{10}$/.test(phone)) {
                const message = "Enter exactly 10 digits for your phone number.";
                if (phoneError) phoneError.textContent = message;
                phoneInput.setCustomValidity(message);
                valid = false;
            }
            if (!valid) {
                if (nameInput && !nameInput.validity.valid) nameInput.reportValidity();
                else if (phoneInput) phoneInput.reportValidity();
                return;
            }
            if (saveButton) {
                saveButton.disabled = true;
                saveButton.innerHTML = '<i class="bi bi-arrow-repeat"></i> Saving...';
            }
            /*--- Persist Registered Profile Details ---*/
            const profileValues = {
                cpRegisteredName: name,
                cpRegisteredPhone: phone
            };
            let saved = true;
            Object.keys(profileValues).forEach(function (key) {
                if (!setStoredValue(key, profileValues[key])) saved = false;
            });
            /*--- Persist Profile Photo ---*/
            if (selectedPhotoData !== originalPhotoData) {
                if (selectedPhotoData) {
                    if (!setStoredValue("cpAdminProfilePhoto", selectedPhotoData)) saved = false;
                } else {
                    try {
                        localStorage.removeItem("cpAdminProfilePhoto");
                        sessionStorage.removeItem("cpAdminProfilePhoto");
                    } catch (error) {
                        saved = false;
                    }
                }
            }
            if (!saved) {
                if (saveButton) {
                    saveButton.disabled = false;
                    saveButton.innerHTML = '<i class="bi bi-check2"></i> Save changes';
                }
                showFeedback("Some details could not be saved. Your browser storage may be full or unavailable.", true);
                return;
            }
            /*--- Record Profile Update Date ---*/
            const updatedAt = new Date().toISOString();
            setStoredValue("cpAdminProfileUpdated", updatedAt);
            originalProfile = {
                name: name,
                email: emailInput.value,
                phone: phone
            };
            originalPhotoData = selectedPhotoData;
            renderProfile();
            renderUpdatedDate();
            setEditing(false);
            if (saveButton) {
                saveButton.disabled = false;
                saveButton.innerHTML = '<i class="bi bi-check2"></i> Save changes';
            }
            showFeedback("Your profile details have been saved successfully.", false);
        });
    }
    /*--- Profile Photo Selection ---*/
    if (photoInput) {
        photoInput.addEventListener("change", function () {
            const file = photoInput.files && photoInput.files[0];
            if (!file) return;
            if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                showFeedback("Choose a JPG, PNG, or WebP image.", true);
                photoInput.value = "";
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                showFeedback("Choose an image smaller than 2 MB.", true);
                photoInput.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onload = function () {
                if (typeof reader.result !== "string") return;
                selectedPhotoData = reader.result;
                if (photoElement) photoElement.src = selectedPhotoData;
                showFeedback("Photo preview updated. Click Edit profile and Save changes to save your profile photo.", false);
            };
            reader.onerror = function () {
                showFeedback("Unable to read this image. Please choose another file.", true);
            };
            reader.readAsDataURL(file);
        });
    }
    /*--- Change Password Navigation ---*/
    function openChangePasswordPage() {
        window.location.href = "404.html";
    }
    const changePasswordButton = document.getElementById("cp-admin-profile-change-password");
    const securityPasswordButton = document.getElementById("cp-admin-profile-security-password");
    if (changePasswordButton) changePasswordButton.addEventListener("click", openChangePasswordPage);
    if (securityPasswordButton) securityPasswordButton.addEventListener("click", openChangePasswordPage);
    /*--- Initial Profile Render ---*/
    renderProfile();
    loadProfilePhoto();
    renderProfile();
    renderUpdatedDate();
    setEditing(false);
    /*--- Existing Profile Data Snapshot ---*/
    originalProfile = {
        name: nameInput ? nameInput.value : "",
        email: emailInput ? emailInput.value : "",
        phone: phoneInput ? phoneInput.value : ""
    };
});
/*--- Admin Profile Initialization End ---*/
