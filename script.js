// Utility function to safely parse JSON
function safeParseJSON(data) {
  try {
    return JSON.parse(data) ?? {};
  } catch {
    return {};
  }
}

// Save custom fields for a specific profile
function saveCustomField() {
  const customFieldName = document.getElementById('customFieldNameInput').value.trim();
  const customFieldValue = document.getElementById('customFieldValueInput').value.trim();
  const profileName = getCurrentlySelectedProfile();

  if (!customFieldName || !customFieldValue || !profileName) {
    alert('Please provide all required fields and select a profile.');
    return;
  }

  const profiles = safeParseJSON(localStorage.getItem('profiles'));
  profiles[profileName] = profiles[profileName] ?? { customFields: {} };
  profiles[profileName].customFields[customFieldName] = customFieldValue;

  localStorage.setItem('profiles', JSON.stringify(profiles));
  updateCustomFieldList(profileName);
}

// Update UI with custom fields for a specific profile
function updateCustomFieldList(profileName) {
  const customFieldList = document.getElementById('customFieldList');
  customFieldList.innerHTML = ''; // Clear the list

  const profiles = safeParseJSON(localStorage.getItem('profiles'));
  const customFields = profiles[profileName]?.customFields ?? {};

  Object.entries(customFields).forEach(([fieldName, fieldValue]) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${fieldName}: ${fieldValue}`;
    customFieldList.appendChild(listItem);
  });
}

// Load profile and populate the UI
function loadProfile(profileName) {
  if (!profileName) return;

  updateCustomFieldList(profileName);
  // Other profile-related UI updates can be added here
}

// Track job applications
function trackApplication() {
  const company = document.getElementById('companyInput').value.trim();
  const jobTitle = document.getElementById('jobTitleInput').value.trim();

  if (!company || !jobTitle) {
    alert('Please provide both company and job title.');
    return;
  }

  const applications = safeParseJSON(localStorage.getItem('applications'));
  const dateApplied = new Date().toISOString().split('T')[0]; // Current date
  applications.push({ company, jobTitle, dateApplied, status: 'Pending' });

  localStorage.setItem('applications', JSON.stringify(applications));
  updateApplicationTable();
}

// Update the job application tracking table
function updateApplicationTable() {
  const applications = safeParseJSON(localStorage.getItem('applications'));
  const tableBody = document.getElementById('applicationTableBody');
  tableBody.innerHTML = ''; // Clear the table

  applications.forEach(({ company, jobTitle, dateApplied, status }) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = company;
    row.insertCell().textContent = jobTitle;
    row.insertCell().textContent = dateApplied;
    row.insertCell().textContent = status;
  });
}

// Export data as JSON
function exportData() {
  const dataToExport = {
    profiles: safeParseJSON(localStorage.getItem('profiles')),
    applications: safeParseJSON(localStorage.getItem('applications')),
  };

  const jsonData = JSON.stringify(dataToExport, null, 2);
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

// Get the currently selected profile name
function getCurrentlySelectedProfile() {
  return document.getElementById('profileSelect')?.value ?? '';
}

// Attach event listeners once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveCustomFieldButton').addEventListener('click', saveCustomField);
  document.getElementById('trackApplicationButton').addEventListener('click', trackApplication);
  document.getElementById('exportDataButton').addEventListener('click', exportData);

  // Initial UI load
  const profileName = getCurrentlySelectedProfile();
  loadProfile(profileName);
  updateApplicationTable();
});
