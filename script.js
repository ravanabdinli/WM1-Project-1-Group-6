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

// Function to remove a custom field from the list
function removeField(button) {
  button.parentNode.remove();
}

function updateProfileOptions() {
  const profileSelect = document.getElementById('profileSelect');
  profileSelect.innerHTML = '<option value="">-- Select Profile --</option>'; // Clear existing options

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // Check if the key starts with 'resumeData_'
    if (key.startsWith('resumeData_')) {
      // Extract the profile name from the key (e.g., 'resumeData_MyProfile' -> 'MyProfile')
      const profileName = key.substring('resumeData_'.length);
      const option = document.createElement('option');
      option.value = profileName;
      option.text = profileName;
      profileSelect.add(option);
    }
  }
}

// Function to save the custom fields data to local storage
function saveDataToLocalStorage() {
  const customFields = [];
  const fieldElements = document.querySelectorAll('#customFieldList .fieldName, #customFieldList .fieldValue');
  const profileName = document.getElementById('profileNameField').value;

  for (let i = 0; i < fieldElements.length; i += 2) {
    const fieldName = fieldElements[i].value;
    const fieldValue = fieldElements[i + 1].value;
    if (fieldName && fieldValue) {
      customFields.push({ name: fieldName, value: fieldValue });
    }
  }

  // ... (Include LinkedIn and other data before saving)
  localStorage.setItem('resumeData', JSON.stringify(customFields));
  localStorage.setItem('resumeData_' + profileName, JSON.stringify(dataToStore));

  updateProfileOptions();
}

// Call saveDataToLocalStorage() when needed (e.g., on form submit, before page unload)

// Function to load a profile's data
function loadProfile() {
  const selectedProfile = document.getElementById('profileSelect').value;
  const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
  const selectedProfileData = profiles.find(profile => profile.name === selectedProfile);

  // ... (Populate form fields with selectedProfileData)
}

// ... (Logic to add/delete profiles and update profileSelect options)
// Function to save the mapping between LinkedIn and custom fields
function saveMapping() {
  const linkedinField = document.getElementById('formFieldMapping').value;
  const customField = document.getElementById('customFormFieldName').value;

  let fieldMappings = JSON.parse(localStorage.getItem('fieldMappings')) || {};
  fieldMappings[customField] = linkedinField;
  localStorage.setItem('fieldMappings', JSON.stringify(fieldMappings));
}

// ... other functions ...

// Function to track a job application
function trackApplication(company, jobTitle, dateApplied, status) {
  let applications = JSON.parse(localStorage.getItem('applications')) || [];
  applications.push({ company, jobTitle, dateApplied, status });
  localStorage.setItem('applications', JSON.stringify(applications));
  updateApplicationDashboard();
}

// Function to update the application dashboard
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



// Modifying the JS part accordingly