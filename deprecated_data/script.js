// Function to save custom fields for a specific profile
function saveCustomField() {
  const customFieldName = document.getElementById('customFieldNameInput').value;
  const customFieldValue = document.getElementById('customFieldValueInput').value;
  const profileName = document.getElementById('profileSelect').value; // Assuming you have a profile selector

  let profiles = JSON.parse(localStorage.getItem('profiles')) || {};
  if (!profiles[profileName]) {
      profiles[profileName] = {};
  }
  profiles[profileName].customFields = profiles[profileName].customFields || {};
  profiles[profileName].customFields[customFieldName] = customFieldValue;
  localStorage.setItem('profiles', JSON.stringify(profiles));

  // Optionally, update the UI to reflect the new custom field
  updateCustomFieldList(profileName);
}

// Function to update the UI with the custom fields for a specific profile
function updateCustomFieldList(profileName) {
  const customFieldList = document.getElementById('customFieldList');
  customFieldList.innerHTML = ''; // Clear the list

  const profiles = JSON.parse(localStorage.getItem('profiles')) || {};
  const customFields = profiles[profileName]?.customFields || {};

  for (const fieldName in customFields) {
    const listItem = document.createElement('li');
    listItem.textContent = `${fieldName}: ${customFields[fieldName]}`;
    customFieldList.appendChild(listItem);
  }
}

// Function to load a profile and populate the UI
function loadProfile(profileName) {
  // ... (Existing code)

  // Display custom fields
  updateCustomFieldList(profileName);

  // ... (rest of loadProfile function)
}

// Function to track job applications
function trackApplication() {
  const company = document.getElementById('companyInput').value;
  const jobTitle = document.getElementById('jobTitleInput').value;
  const dateApplied = new Date().toISOString().split('T')[0]; // Get current date
  const status = 'Pending'; // Initial status

  let applications = JSON.parse(localStorage.getItem('applications')) || [];
  applications.push({ company, jobTitle, dateApplied, status });
  localStorage.setItem('applications', JSON.stringify(applications));

  updateApplicationTable();
}

// Function to update the job application tracking table
function updateApplicationTable() {
  const applications = JSON.parse(localStorage.getItem('applications')) || [];
  const tableBody = document.getElementById('applicationTableBody');
  tableBody.innerHTML = ''; // Clear the table

  applications.forEach(app => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = app.company;
    row.insertCell().textContent = app.jobTitle;
    row.insertCell().textContent = app.dateApplied;
    row.insertCell().textContent = app.status;
  });
}

// Function to export data
function exportData() {
  const dataToExport = {
    profiles: JSON.parse(localStorage.getItem('profiles')),
    applications: JSON.parse(localStorage.getItem('applications')),
    // ... other data
  };

  const jsonData = JSON.stringify(dataToExport);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'my_extension_data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Get currently selected profile name (Assuming you have a profileSelect dropdown)
function getCurrentlySelectedProfile() {
  return document.getElementById('profileSelect').value;
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Custom field event listeners
  document.getElementById('saveCustomFieldButton').addEventListener('click', saveCustomField);
  document.getElementById('customFieldNameInput').addEventListener('change', saveCustomField);
  document.getElementById('customFieldValueInput').addEventListener('change', saveCustomField);

  // Application tracking event listener
  document.getElementById('trackApplicationButton').addEventListener('click', trackApplication);

  // Data export event listener
  document.getElementById('exportDataButton').addEventListener('click', exportData);

  // Load initial data
  const profileName = getCurrentlySelectedProfile();
  updateCustomFieldList(profileName);
  updateApplicationTable();
});


// Partially Updating JS part