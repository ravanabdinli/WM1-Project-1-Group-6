document.addEventListener('DOMContentLoaded', function() {
    loadProfileList();
    
    // Ensure event listeners are correctly attached when DOM is loaded
    document.getElementById('profileSelect').addEventListener('change', loadSelectedProfile);
    document.getElementById('saveButton').addEventListener('click', saveProfile);
    document.getElementById('newProfileButton').addEventListener('click', createNewProfile);
    document.getElementById('deleteProfileButton').addEventListener('click', deleteProfile);
    document.getElementById('viewDashboardButton').addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });

    document.getElementById('saveHistoryButton').addEventListener('click', saveHistory);
    document.getElementById('loadHistoryButton').addEventListener('click', loadHistory);

    document.getElementById('exportDataButton').addEventListener('click', exportData);
    document.getElementById('importDataButton').addEventListener('click', function() {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importData);
    document.getElementById('emailDataButton').addEventListener('click', emailData);
});

function loadProfileList() {
    chrome.storage.local.get(['profileList'], function(result) {
        const profileSelect = document.getElementById('profileSelect');
        profileSelect.innerHTML = '<option value="">--Select Profile--</option>';
        if (result.profileList) {
            result.profileList.forEach(profile => {
                const option = document.createElement('option');
                option.value = profile;
                option.textContent = profile;
                profileSelect.appendChild(option);
            });
        }
    });
}

function loadSelectedProfile() {
    const profileName = document.getElementById('profileSelect').value;
    if (profileName) {
        chrome.storage.local.get([profileName], function(result) {
            const profileData = result[profileName];
            if (profileData) {
                fillForm(profileData);
            } else {
                document.getElementById('profileForm').reset(); // Reset form if no data is found
            }
        });
    } else {
        document.getElementById('profileForm').reset();
    }
}

function saveProfile() {
    // Required fields
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // Validation to check if required fields are filled
    if (!firstName || !lastName || !dob || !email || !phone) {
        alert('Please fill in all the required fields: First Name, Last Name, Date of Birth, Email, and Phone.');
        return;
    }

    const profileName = document.getElementById('profileSelect').value;
    if (!profileName) {
        alert('Please select or create a profile to save.');
        return;
    }

    const profileData = getFormData();

    chrome.storage.local.set({ [profileName]: profileData }, function() {
        if (chrome.runtime.lastError) {
            alert(`Error saving profile: ${chrome.runtime.lastError.message}`);
        } else {
            alert('Profile saved successfully!');
        }
    });
}

function createNewProfile() {
    const profileName = prompt('Enter a name for the new profile:');
    if (!profileName) {
        return;
    }

    chrome.storage.local.get(['profileList'], function(result) {
        let profileList = result.profileList || [];
        if (!profileList.includes(profileName)) {
            profileList.push(profileName);
            chrome.storage.local.set({ profileList }, function() {
                loadProfileList();
                document.getElementById('profileSelect').value = profileName;
                loadSelectedProfile(); // Load the newly created profile
                alert('New profile created!');
            });
        } else {
            alert('A profile with this name already exists.');
        }
    });
}

function deleteProfile() {
    const profileName = document.getElementById('profileSelect').value;
    if (!profileName) {
        alert('Please select a profile to delete.');
        return;
    }

    chrome.storage.local.get(['profileList'], function(result) {
        let profileList = result.profileList || [];
        profileList = profileList.filter(profile => profile !== profileName);
        chrome.storage.local.remove(profileName, function() {
            chrome.storage.local.set({ profileList }, function() {
                loadProfileList();
                document.getElementById('profileForm').reset();
                alert('Profile deleted successfully!');
            });
        });
    });
}

function saveHistory() {
    const formData = getFormData();
    chrome.storage.local.set({ savedForm: formData }, function() {
        if (chrome.runtime.lastError) {
            alert(`Error saving form: ${chrome.runtime.lastError.message}`);
        } else {
            alert('Form saved for later submission!');
        }
    });
}

function loadHistory() {
    chrome.storage.local.get(['savedForm'], function(result) {
        if (result.savedForm) {
            fillForm(result.savedForm);
            alert('Form loaded successfully!');
        } else {
            alert('No saved form found.');
        }
    });
}

function exportData() {
    chrome.storage.local.get(null, function(data) {
        if (chrome.runtime.lastError) {
            alert(`Error exporting data: ${chrome.runtime.lastError.message}`);
            return;
        }
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "profile_data.json";
        a.click();
        URL.revokeObjectURL(url);
    });
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            chrome.storage.local.set(data, function() {
                if (chrome.runtime.lastError) {
                    alert(`Error importing data: ${chrome.runtime.lastError.message}`);
                } else {
                    loadProfileList();
                    alert('Data imported successfully!');
                }
            });
        } catch (e) {
            alert('Error parsing JSON file. Please ensure it is a valid JSON.');
        }
    };
    reader.readAsText(file);
}

function emailData() {
    chrome.storage.local.get(null, function(data) {
        if (chrome.runtime.lastError) {
            alert(`Error fetching data for email: ${chrome.runtime.lastError.message}`);
            return;
        }
        const json = JSON.stringify(data, null, 2);
        const mailtoLink = `mailto:?subject=Exported%20Profile%20Data&body=${encodeURIComponent(json)}`;
        window.location.href = mailtoLink;
    });
}

function getFormData() {
    return {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        country: document.getElementById('country').value,
        city: document.getElementById('city').value,
        contactInfo: document.getElementById('contactInfo').value,
        address: document.getElementById('address').value,
        experience: document.getElementById('experience').value,
        skills: document.getElementById('skills').value,
        aboutYourself: document.getElementById('aboutYourself').value,
        aboutMe: document.getElementById('aboutMe').value,
        education: document.getElementById('education').value,
        portfolio: document.getElementById('portfolio').value
    };
}

function fillForm(formData) {
    document.getElementById('firstName').value = formData.firstName || '';
    document.getElementById('lastName').value = formData.lastName || '';
    document.getElementById('dob').value = formData.dob || '';
    document.getElementById('email').value = formData.email || '';
    document.getElementById('phone').value = formData.phone || '';
    document.getElementById('country').value = formData.country || '';
    document.getElementById('city').value = formData.city || '';
    document.getElementById('contactInfo').value = formData.contactInfo || '';
    document.getElementById('address').value = formData.address || '';
    document.getElementById('experience').value = formData.experience || '';
    document.getElementById('skills').value = formData.skills || '';
    document.getElementById('aboutYourself').value = formData.aboutYourself || '';
    document.getElementById('aboutMe').value = formData.aboutMe || '';
    document.getElementById('education').value = formData.education || '';
    document.getElementById('portfolio').value = formData.portfolio || '';
}
