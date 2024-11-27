// content.js

// Listen for messages from the extension
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "saveForm") {
        saveCurrentForm();
    } else if (request.action === "loadForm") {
        loadSavedForm();
    }
});

// Save current form data
function saveCurrentForm() {
    const forms = document.forms;
    if (forms.length === 0) {
        alert("No forms found on this page to save.");
        return;
    }

    let formData = {};
    for (let i = 0; i < forms.length; i++) {
        const formElements = forms[i].elements;
        for (let j = 0; j < formElements.length; j++) {
            const element = formElements[j];
            if (element.name) {
                formData[element.name] = element.value;
            }
        }
    }

    chrome.storage.local.set({ savedFormData: formData }, function() {
        alert("Form data saved successfully!");
    });
}

// Load saved form data
function loadSavedForm() {
    chrome.storage.local.get(['savedFormData'], function(result) {
        if (result.savedFormData) {
            const formData = result.savedFormData;

            for (let name in formData) {
                const element = document.querySelector(`[name="${name}"]`);
                if (element) {
                    element.value = formData[name];
                }
            }
            alert("Form data loaded successfully!");
        } else {
            alert("No saved form data found.");
        }
    });
}
