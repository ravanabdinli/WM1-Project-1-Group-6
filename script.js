// Suggested code may be subject to a license. Learn more: ~LicenseLog:3870601861.
// Custom Fields
function addCustomField() {
  const fieldList = document.getElementById('customFieldList');
  const newField = document.createElement('div');
  newField.innerHTML = `
    <input type="text" placeholder="Field Name" class="fieldName">
    <input type="text" placeholder="Field Value" class="fieldValue">
    <button onclick="removeField(this)">Remove</button>
  `;
  fieldList.appendChild(newField);
}

function removeField(button) {
  button.parentNode.remove();
}

function saveDataToLocalStorage() {
  const customFields = [];
  const fieldElements = document.querySelectorAll('#customFieldList .fieldName, #customFieldList .fieldValue');

  for (let i = 0; i < fieldElements.length; i += 2) {
    const fieldName = fieldElements[i].value;
    const fieldValue = fieldElements[i + 1].value;
    if (fieldName && fieldValue) {
      customFields.push({ name: fieldName, value: fieldValue });
    }
  }

  // ... (Include other data before saving)
  localStorage.setItem('resumeData', JSON.stringify(customFields));
}

// Profile Switching
function loadProfile() {
  const selectedProfile = document.getElementById('profileSelect').value;
  const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
  const selectedProfileData = profiles.find(profile => profile.name === selectedProfile);

  // ... (Populate form fields with selectedProfileData)
}

// Form Field Mapping
function saveMapping() {
  const linkedinField = document.getElementById('formFieldMapping').value;
  const customField = document.getElementById('customFormFieldName').value;

  let fieldMappings = JSON.parse(localStorage.getItem('fieldMappings')) || {};
  fieldMappings[customField] = linkedinField;
  localStorage.setItem('fieldMappings', JSON.stringify(fieldMappings));
}

// Job Application Tracking Dashboard
function trackApplication(company, jobTitle, dateApplied, status) {
  let applications = JSON.parse(localStorage.getItem('applications')) || [];
  applications.push({ company, jobTitle, dateApplied, status });
  localStorage.setItem('applications', JSON.stringify(applications));
  updateApplicationDashboard();
}

function updateApplicationDashboard() {
  const tableBody = document.querySelector('#applicationTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  const applications = JSON.parse(localStorage.getItem('applications')) || [];
  applications.forEach(application => {
    const row = tableBody.insertRow();
    const companyCell = row.insertCell();
    const jobTitleCell = row.insertCell();
    const dateAppliedCell = row.insertCell();
    const statusCell = row.insertCell();

    companyCell.textContent = application.company;
    jobTitleCell.textContent = application.jobTitle;
    dateAppliedCell.textContent = application.dateApplied;
    statusCell.textContent = application.status;
  });
}

// Call trackApplication() when a job application is submitted
// Call updateApplicationDashboard() on page load and after tracking an application


// History Restoring
function saveFormToHistory() {
  const formData = {
    // ... (Collect data from form fields)
  };
  const timestamp = new Date().toISOString(); // Or use a unique ID
  let formHistory = JSON.parse(localStorage.getItem('formHistory')) || [];
  formHistory.push({ timestamp, data: formData });
  localStorage.setItem('formHistory', JSON.stringify(formHistory));
  updateHistoryList();
}

function updateHistoryList() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = ''; // Clear existing list

  const formHistory = JSON.parse(localStorage.getItem('formHistory')) || [];
  formHistory.forEach(entry => {
    const listItem = document.createElement('li');
    listItem.textContent = entry.timestamp; // Or display other relevant info
    listItem.onclick = () => {
      // ... (Highlight selected entry and prepare for restoration)
    };
    historyList.appendChild(listItem);
  });
}
// History Restoring (continued)
function restoreForm() {
  // ... (Get the selected entry from the history list)
  const historyList = document.getElementById('historyList'); // Assuming your history list has this ID
  let selectedEntry = null;

  for (let i = 0; i < historyList.children.length; i++) {
    const listItem = historyList.children[i];
    if (listItem.classList.contains('selected')) { // Assuming 'selected' class is used for highlighting
      selectedEntry = formHistory[i]; // Get entry from formHistory array using index
      break;
    }
  }

  if (selectedEntry) {
    const formData = selectedEntry.data;

    // ... (Populate form fields with data from formData)
    // Example:
    // document.getElementById('fieldName').value = formData.fieldName;
    // ... (Populate other form fields similarly)
  } else {
    // Handle case where no entry is selected (e.g., show a message)
    console.log("No entry selected from history.");
  }
}


// Data Transfer
function exportData() {
  const resumeData = {
    // ... (Collect all resume data)
  };
  const jsonData = JSON.stringify(resumeData);
  const blob = new Blob([jsonData], { type: 'application/json' });
  
const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume_data.json';
  a.click();
  URL.revokeObjectURL(url);
}

const importFile = document.getElementById('importFile');
importFile.onchange = function() {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const importedData = JSON.parse(e.target.result);
    // ... (Populate form fields with importedData)
  };
  reader.readAsText(file);
};

function sendDataViaEmail() {
  const resumeData = {
    // ... (Collect all resume data)
  };
  const jsonData = JSON.stringify(resumeData);
  const mailtoLink = `mailto:?subject=My Resume Data&body=${encodeURIComponent(jsonData)}`;
  window.location.href = mailtoLink;
}

