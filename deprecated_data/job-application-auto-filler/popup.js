const profileSelector = document.getElementById("profile-selector");
const jobForm = document.getElementById("jobForm");

let profiles = {}; // Stores all profiles
let currentProfile = null; // Active profile

// Load profiles from Chrome storage on extension load
function loadProfiles() {
    chrome.storage.local.get("profiles", (result) => {
        profiles = result.profiles || {};
        populateProfileSelector();
        if (Object.keys(profiles).length > 0) {
            currentProfile = profileSelector.value || Object.keys(profiles)[0];
            populateFields(currentProfile);
        }
    });
}

// Save profiles to Chrome storage
function saveProfiles() {
    chrome.storage.local.set({ profiles }, () => {
        console.log("Profiles saved.");
    });
}

// Populate profile selector dropdown
function populateProfileSelector() {
    profileSelector.innerHTML = "";
    Object.keys(profiles).forEach((profileName) => {
        const option = document.createElement("option");
        option.value = profileName;
        option.textContent = profileName;
        profileSelector.appendChild(option);
    });

    // Select the current profile
    if (currentProfile) {
        profileSelector.value = currentProfile;
    }
}

// Populate form fields with data from the selected profile
function populateFields(profileName) {
    const profileData = profiles[profileName] || {};
    document.getElementById("company").value = profileData.company || "";
    document.getElementById("jobTitle").value = profileData.jobTitle || "";
    document.getElementById("dateApplied").value = profileData.dateApplied || "";
    document.getElementById("status").value = profileData.status || "";
}

// Handle form submission
jobForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!currentProfile) {
        alert("Please select or create a profile.");
        return;
    }

    const profileData = {
        company: document.getElementById("company").value,
        jobTitle: document.getElementById("jobTitle").value,
        dateApplied: document.getElementById("dateApplied").value,
        status: document.getElementById("status").value,
    };

    profiles[currentProfile] = profileData;
    saveProfiles();
    alert("Profile saved successfully!");
});

// Handle profile selection change
profileSelector.addEventListener("change", () => {
    currentProfile = profileSelector.value;
    populateFields(currentProfile);
});

// Create a new profile
document.getElementById("new-profile").addEventListener("click", () => {
    const profileName = prompt("Enter profile name:");
    if (!profileName) return;

    if (profiles[profileName]) {
        alert("Profile already exists.");
        return;
    }

    profiles[profileName] = {}; // Create empty profile
    currentProfile = profileName;
    saveProfiles();
    populateProfileSelector();
    populateFields(currentProfile);
});

// Delete the current profile
document.getElementById("delete-profile").addEventListener("click", () => {
    if (!currentProfile) {
        alert("No profile selected.");
        return;
    }

    if (confirm(`Are you sure you want to delete the profile "${currentProfile}"?`)) {
        delete profiles[currentProfile];
        saveProfiles();
        const profileNames = Object.keys(profiles);
        currentProfile = profileNames.length > 0 ? profileNames[0] : null;
        populateProfileSelector();
        if (currentProfile) {
            populateFields(currentProfile);
        } else {
            jobForm.reset();
        }
    }
});

// Initialize the extension
loadProfiles();
