document.addEventListener('DOMContentLoaded', function () {
    loadProfileList();

    document.getElementById('profileSelect').addEventListener('change', loadSelectedProfile);
    document.getElementById('saveButton').addEventListener('click', saveProfile);
    document.getElementById('newProfileButton').addEventListener('click', createNewProfile);
    document.getElementById('deleteProfileButton').addEventListener('click', deleteProfile);
    document.getElementById('viewDashboardButton').addEventListener('click', function () {
        window.location.href = 'dashboard.html';
    });

    document.getElementById('saveHistoryButton').addEventListener('click', saveHistory);
    document.getElementById('loadHistoryButton').addEventListener('click', loadHistory);

    document.getElementById('exportDataButton').addEventListener('click', exportData);
    document.getElementById('importDataButton').addEventListener('click', function () {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importData);
    document.getElementById('emailDataButton').addEventListener('click', emailData);

    // Add new buttons for saving and loading forms on any website
    document.getElementById('saveCurrentFormButton').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: () => chrome.runtime.sendMessage({ action: "saveForm" })
            });
        });
    });

    document.getElementById('loadSavedFormButton').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: () => chrome.runtime.sendMessage({ action: "loadForm" })
            });
        });
    });
});

function loadProfileList() {
    chrome.storage.local.get(['profileList'], function (result) {
        const profileSelect = document.getElementById('profileSelect');
        // profileSelect.innerHTML = '<option value="">--Select Profile--</option>';
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
        chrome.storage.local.get([profileName], function (result) {
            const profileData = result[profileName];
            if (profileData) {
                fillForm(profileData);
            } else {
                document.getElementById('profileForm').reset();
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

    chrome.storage.local.set({ [profileName]: profileData }, function () {
        alert('Profile saved successfully!');
    });
}

function createNewProfile() {
    const profileName = prompt('Enter a name for the new profile:');
    if (!profileName) {
        return;
    }

    chrome.storage.local.get(['profileList'], function (result) {
        let profileList = result.profileList || [];
        if (!profileList.includes(profileName)) {
            profileList.push(profileName);
            chrome.storage.local.set({ profileList }, function () {
                loadProfileList();
                document.getElementById('profileSelect').value = profileName;
                loadSelectedProfile(); // Load the newly created profile immediately
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

    chrome.storage.local.get(['profileList'], function (result) {
        let profileList = result.profileList || [];
        profileList = profileList.filter(profile => profile !== profileName);
        chrome.storage.local.remove(profileName, function () {
            chrome.storage.local.set({ profileList }, function () {
                loadProfileList();
                document.getElementById('profileForm').reset();
                alert('Profile deleted successfully!');
            });
        });
    });
}

function saveHistory() {
    const formData = getFormData();
    chrome.storage.local.set({ savedForm: formData }, function () {
        alert('Form saved for later submission!');
    });
}

function loadHistory() {
    chrome.storage.local.get(['savedForm'], function (result) {
        if (result.savedForm) {
            fillForm(result.savedForm);
            alert('Form loaded successfully!');
        } else {
            alert('No saved form found.');
        }
    });
}

function getFormData() {
    return {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        experience: document.getElementById('experience').value,
        skills: document.getElementById('skills').value,
        address: document.getElementById('address').value,
        country: document.getElementById('country').value,
        city: document.getElementById('city').value,
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
    document.getElementById('experience').value = formData.experience || '';
    document.getElementById('skills').value = formData.skills || '';
    document.getElementById('address').value = formData.address || '';
    document.getElementById('country').value = formData.country || '';
    document.getElementById('city').value = formData.city || '';
    document.getElementById('aboutMe').value = formData.aboutMe || '';
    document.getElementById('education').value = formData.education || '';
    document.getElementById('portfolio').value = formData.portfolio || '';
}

function exportData() {
    chrome.storage.local.get(null, function (data) {
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
    reader.onload = function (event) {
        const data = JSON.parse(event.target.result);
        chrome.storage.local.set(data, function () {
            alert('Data imported successfully!');
            loadProfileList();
        });
    };
    reader.readAsText(file);
}



// Check if the current page is index.html
if (window.location.pathname.endsWith("index.html")) {
    // Retrieve data from Chrome local storage
    chrome.storage.local.get(["userData"], function (result) {
        if (result.userData) {
            if (confirm("Fetched data from LinkedIn has been found. Do you want to load the fetched data?")) {
                console.log("Retrieved user data:", result.userData);

                // Set form fields only if the data exists
                document.getElementById('firstName').value = result.userData.firstname || '';
                document.getElementById('lastName').value = result.userData.lastname || '';
                document.getElementById('aboutMe').value = result.userData.about || '';
            } else {
                chrome.storage.local.remove("userData", function () {
                    console.log("userData has been deleted from local storage.");
                });
            }
        } else {
            console.log("No user data found in local storage.");
        }
    });
}


// JavaScript code to fill in the form based on the profile data when clicking the 'Fill in the Form' button

document.addEventListener("DOMContentLoaded", function () {
    const fillButton = document.getElementById("fill");

    fillButton.addEventListener("click", function () {
        // Use Chrome's scripting API to inject code into the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: fillWebsiteForm,
                args: [getProfileData()], // Pass the profile data to the function
            });
        });
    });
});

// Function to retrieve profile data from the form
function getProfileData() {
    return {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        dob: document.getElementById("dob").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        country: document.getElementById("country").value,
        city: document.getElementById("city").value,
        experience: document.getElementById("experience").value,
        skills: document.getElementById("skills").value,
        address: document.getElementById("address").value,
        aboutMe: document.getElementById("aboutMe").value,
        education: document.getElementById("education").value,
        portfolio: document.getElementById("portfolio").value
    };
}

// Function to be executed on the active tab to fill in the form
function fillWebsiteForm(profileData)
{
    //The fillWebsiteForm function automates filling out online forms. It maps common profile fields to potential form field selectors, then locates and fills the corresponding fields on the website. This saves time, reduces errors, and streamlines repetitive tasks.
    //OpenAI. (2024). ChatGPT [Large language model]. https://chatgpt.com
    const fieldMappings = {
        firstName: ["first-name", "firstname", "first_name", "name", "givenname", "first"],
        lastName: ["last-name", "lastname", "last_name", "surname", "familyname", "secondname"],
        dob: ["date-of-birth", "dob", "dateofbirth", "birthdate", "birthday"],
        email: ["email-address", "email", "email_address", "emailaddress"],
        phone: ["phone-number", "phone", "phone_number", "phonenumber", "contact"],
        country: ["country", "nation", "region", "location", "province"],
        city: ["city", "town", "location"],
        experience: ["experiences", "experience", "work_experience", "job_experience"],
        skills: ["skills", "technical_skills", "soft_skills", "relevant_skills"],
        address: ["street-address", "address", "street", "street_address", "streetaddress"],
        aboutMe: ["aboutme", "about", "summary", "bio", "aboutMe"],
        education: ["education", "educations", "studies", "academic_experience"],
        portfolio: ["portfolio", "projects", "projects_work", "project_experience", "completed_projects"]
    };

    // Iterate through the field mappings and populate the form fields
    for (const [profileKey, selectors] of Object.entries(fieldMappings)) {
        for (const selector of selectors) {
            const element = document.querySelector(`[name='${selector}']`);
            if (element && profileData[profileKey]) {
                element.value = profileData[profileKey];

                element.dispatchEvent(new Event("input", { bubbles: true }));
                element.dispatchEvent(new Event("change", { bubbles: true }));
                break;
            }
        }
    }
    alert("Form filled with the selected profile data!");
}

//W3Schools.com. (n.d.-b). https://www.w3schools.com/jsref/event_bubbles.asp
//EventTarget: addEventListener() method - Web APIs | MDN. (2024, November 21). MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
document.getElementById("exportDataButton").addEventListener("click", function () {
    const formFields = [
        "firstName",
        "lastName",
        "dob",
        "email",
        "phone",
        "country",
        "city",
        "experience",
        "skills",
        "address",
        "aboutMe",
        "education",
        "portfolio"
    ];

    const data = {};
    formFields.forEach((field) => {
        const element = document.getElementById(field);
        if (element) {
            data[field] = element.value;
        }
    });

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "profile_data.json";
    a.click();

    URL.revokeObjectURL(url);
});

// Function to import data
document.getElementById("importDataButton").addEventListener("click", function () {
    const importFileInput = document.getElementById("importFile");
    importFileInput.click();

    importFileInput.addEventListener("change", function () {
        const file = importFileInput.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    for (const key in data) {
                        const element = document.getElementById(key);
                        if (element) {
                            element.value = data[key];
                        }
                    }
                    alert("Data imported successfully!");
                } catch (error) {
                    alert("Invalid file format. Please upload a valid JSON file.");
                }
            };

            reader.readAsText(file);
        }
    });
});

document.getElementById("saveHistoryButton").addEventListener("click", function () {
    const formFields = [
        "firstName",
        "lastName",
        "dob",
        "email",
        "phone",
        "country",
        "city",
        "experience",
        "skills",
        "address",
        "aboutMe",
        "education",
        "portfolio"
    ];

    const data = {};
    formFields.forEach((field) => {
        const element = document.getElementById(field);
        if (element) {
            data[field] = element.value;
        }
    });

    try {
        localStorage.setItem("savedProfileData", JSON.stringify(data));
        alert("Data saved for later successfully!");
    } catch (error) {
        alert("Failed to save data. Your browser may not support localStorage.");
    }
});

// Load Saved Later functionality
document.getElementById("loadHistoryButton").addEventListener("click", function () {
    const savedData = localStorage.getItem("savedProfileData");
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            for (const key in data) {
                const element = document.getElementById(key);
                if (element) {
                    element.value = data[key];
                }
            }
            alert("Saved data loaded successfully!");
        } catch (error) {
            alert("Failed to load data. The saved data might be corrupted.");
        }
    } else {
        alert("No saved data found!");
    }
});
