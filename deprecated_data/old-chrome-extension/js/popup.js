const sections = {
  dashboard: document.getElementById("dashboard-section"),
  manualEntry: document.getElementById("manual-entry-section"),
  viewData: document.getElementById("view-data-section"),
  profiles: document.getElementById("profiles-section"),
  dataTransfer: document.getElementById("data-transfer-section"),
};

// Navigation Buttons
document.getElementById("nav-dashboard").addEventListener("click", () => showSection("dashboard"));
document.getElementById("nav-view-data").addEventListener("click", () => showSection("viewData"));
document.getElementById("nav-manual-entry").addEventListener("click", () => showSection("manualEntry"));
document.getElementById("nav-profiles").addEventListener("click", () => showSection("profiles"));
document.getElementById("nav-data-transfer").addEventListener("click", () => showSection("dataTransfer"));

// Show specific section
function showSection(section) {
  Object.values(sections).forEach((s) => (s.style.display = "none"));
  sections[section].style.display = "block";
}

// Dashboard: Add and Display Applications
const applicationForm = document.getElementById("application-form");
const applicationTableBody = document.getElementById("application-table").querySelector("tbody");

applicationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const application = {
    company: document.getElementById("company").value,
    jobTitle: document.getElementById("jobTitle").value,
    dateApplied: document.getElementById("dateApplied").value,
    status: document.getElementById("status").value,
  };

  chrome.storage.local.get("applications", (result) => {
    const applications = result.applications || [];
    applications.push(application);
    chrome.storage.local.set({ applications }, () => {
      loadApplications();
      applicationForm.reset();
    });
  });
});

function loadApplications() {
  chrome.storage.local.get("applications", (result) => {
    const applications = result.applications || [];
    applicationTableBody.innerHTML = "";
    applications.forEach((app) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${app.company}</td>
        <td>${app.jobTitle}</td>
        <td>${app.dateApplied}</td>
        <td>${app.status}</td>
      `;
      applicationTableBody.appendChild(row);
    });
  });
}

// Profiles: Add, Edit, and Delete Profiles
document.getElementById("new-profile").addEventListener("click", () => {
  document.getElementById("profile-editor").style.display = "block";
});

document.getElementById("save-profile").addEventListener("click", () => {
  const profileName = document.getElementById("profile-name").value;

  chrome.storage.local.get("profiles", (result) => {
    const profiles = result.profiles || {};
    profiles[profileName] = {}; // Empty profile
    chrome.storage.local.set({ profiles }, () => {
      loadProfiles();
      document.getElementById("profile-editor").style.display = "none";
    });
  });
});

function loadProfiles() {
  chrome.storage.local.get("profiles", (result) => {
    const profiles = result.profiles || {};
    const profileList = document.getElementById("profile-list");
    profileList.innerHTML = "";
    Object.keys(profiles).forEach((profileName) => {
      const li = document.createElement("li");
      li.textContent = profileName;
      profileList.appendChild(li);
    });
  });
}

// Data Transfer: Export and Email
document.getElementById("export-data").addEventListener("click", () => {
  chrome.storage.local.get(null, (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form_filler_data.json";
    a.click();
  });
});

document.getElementById("send-email").addEventListener("click", () => {
  alert("Email functionality will be added soon.");
});
