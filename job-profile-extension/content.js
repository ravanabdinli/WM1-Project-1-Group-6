// content.js
(function() {
    // Create and add "Save Form Data" and "Load Saved Data" buttons to the page
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save Form Data';
    saveButton.style.position = 'fixed';
    saveButton.style.top = '10px';
    saveButton.style.right = '150px';
    saveButton.style.zIndex = 1000;
    saveButton.style.padding = '10px';
    saveButton.style.backgroundColor = '#4CAF50';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.cursor = 'pointer';
    document.body.appendChild(saveButton);

    const loadButton = document.createElement('button');
    loadButton.innerText = 'Load Saved Data';
    loadButton.style.position = 'fixed';
    loadButton.style.top = '10px';
    loadButton.style.right = '10px';
    loadButton.style.zIndex = 1000;
    loadButton.style.padding = '10px';
    loadButton.style.backgroundColor = '#2196F3';
    loadButton.style.color = 'white';
    loadButton.style.border = 'none';
    loadButton.style.cursor = 'pointer';
    document.body.appendChild(loadButton);

    // Function to get form data from the current page
    function getFormData() {
        const formData = {};
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.name) {
                formData[input.name] = input.value;
            }
        });
        return formData;
    }

    // Function to fill the form with saved data
    function fillFormData(savedData) {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (savedData[input.name]) {
                input.value = savedData[input.name];
            }
        });
    }

    // Save form data when "Save Form Data" button is clicked
    saveButton.addEventListener('click', function() {
        const formData = getFormData();
        chrome.storage.local.set({ 'savedWebFormData': formData }, function() {
            alert('Form data saved successfully!');
        });
    });

    // Load saved form data when "Load Saved Data" button is clicked
    loadButton.addEventListener('click', function() {
        chrome.storage.local.get(['savedWebFormData'], function(result) {
            if (result.savedWebFormData) {
                fillFormData(result.savedWebFormData);
                alert('Form data loaded successfully!');
            } else {
                alert('No saved form data found.');
            }
        });
    });
})();
