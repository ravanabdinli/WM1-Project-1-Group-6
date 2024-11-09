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
  button.closest('div').remove();
}

function saveDataToLocalStorage() {
  const customFields = Array.from(document.querySelectorAll('#customFieldList .fieldName, #customFieldList .fieldValue'))
    .reduce((fields, el, index, arr) => {
      if (index % 2 === 0 && el.value && arr[index + 1].value) {
        fields.push({ name: el.value, value: arr[index + 1].value });
      }
      return fields;
    }, []);
  
  localStorage.setItem('resumeData', JSON.stringify(customFields));
}

// Profile Switching
function loadProfile() {
  const selectedProfile = document.getElementById('profileSelect').value;
  const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
  const selectedProfileData = profiles.find(profile => profile.name === selectedProfile);
  
  if (selectedProfileData) {
    // Populate form fields with selectedProfileData
    // Example: document.getElementById('profileName').value = selectedProfileData.name;
  }
}

// Form Field Mapping
function saveMapping() {
  const linkedinField = document.getElementById('formFieldMapping').value;
  const customField = document.getElementById('customFormFieldName').value;

  const fieldMappings = JSON.parse(localStorage.getItem('fieldMappings')) || {};
  fieldMappings[customField] = linkedinField;
  localStorage.setItem('fieldMappings', JSON.stringify(fieldMappings));
}

// Job Application Tracking Dashboard
function trackApplication(company, jobTitle, dateApplied, status) {
  const applications = JSON.parse(localStorage.getItem('applications')) || [];
  applications.push({ company, jobTitle, dateApplied, status });
  localStorage.setItem('applications', JSON.stringify(applications));
  updateApplicationDashboard();
}

function updateApplicationDashboard() {
  const tableBody = document.querySelector('#applicationTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  const applications = JSON.parse(localStorage.getItem('applications')) || [];
  applications.forEach(({ company, jobTitle, dateApplied, status }) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = company;
    row.insertCell().textContent = jobTitle;
    row.insertCell().textContent = dateApplied;
    row.insertCell().textContent = status;
  });
}

// History Restoring
function saveFormToHistory() {
  const formData = {
    // Collect data from form fields
  };
  const timestamp = new Date().toISOString();
  const formHistory = JSON.parse(localStorage.getItem('formHistory')) || [];
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
    listItem.textContent = entry.timestamp;
    listItem.onclick = () => restoreForm(entry);
    historyList.appendChild(listItem);
  });
}

function restoreForm(selectedEntry) {
  if (selectedEntry) {
    const formData = selectedEntry.data;
    // Populate form fields with data from formData
    // Example: document.getElementById('fieldName').value = formData.fieldName;
  } else {
    console.log("No entry selected from history.");
  }
}

// Data Transfer
function exportData() {
  const resumeData = {
    // Collect all resume data
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

document.getElementById('importFile').onchange = function() {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const importedData = JSON.parse(e.target.result);
    // Populate form fields with importedData
  };
  reader.readAsText(file);
};

function sendDataViaEmail() {
  const resumeData = {
    // Collect all resume data
  };
  const jsonData = JSON.stringify(resumeData);
  const mailtoLink = `mailto:?subject=My Resume Data&body=${encodeURIComponent(jsonData)}`;
  window.location.href = mailtoLink;
}
