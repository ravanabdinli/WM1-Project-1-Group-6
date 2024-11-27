// contentScript.js
(function() {
    // Create a container to hold both buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'formButtonContainer';

    // Create buttons for Save and Load
    const saveButton = document.createElement('button');
    const loadButton = document.createElement('button');
    saveButton.innerText = 'Save Current Form';
    loadButton.innerText = 'Load Saved Form';
    saveButton.id = 'saveFormButton';
    loadButton.id = 'loadFormButton';

    // Style the container for vertical layout
    buttonContainer.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column; /* Vertical layout */
        gap: 10px;
    `;

    // Style the buttons
    const buttonStyle = `
        padding: 10px 15px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        color: white;
        border-radius: 20px; /* Rounded appearance */
        background-color: #6a0dad; /* Dark purple color */
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3); /* Shadow effect for depth */
    `;

    saveButton.style = buttonStyle;
    loadButton.style = buttonStyle;

    // Append buttons to the container
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(loadButton);

    // Append the container to the page
    document.body.appendChild(buttonContainer);

    // Attach event listeners to buttons
    saveButton.addEventListener('click', saveCurrentForm);
    loadButton.addEventListener('click', loadSavedForm);

    function saveCurrentForm() {
        // Collect all input values from the form on the current page
        const formElements = document.querySelectorAll('input, select, textarea');
        const formData = {};
        formElements.forEach(element => {
            if (element.name) {
                formData[element.name] = element.value;
            }
        });

        // Store the form data in Chrome storage
        chrome.storage.local.set({ 'savedFormData': formData }, function() {
            alert('Form data saved successfully!');
        });
    }

    function loadSavedForm() {
        // Retrieve saved form data
        chrome.storage.local.get(['savedFormData'], function(result) {
            const savedFormData = result.savedFormData;

            if (savedFormData) {
                const formElements = document.querySelectorAll('input, select, textarea');
                formElements.forEach(element => {
                    if (savedFormData[element.name] !== undefined) {
                        element.value = savedFormData[element.name];
                    }
                });
                alert('Form data loaded successfully!');
            } else {
                alert('No saved form data found.');
            }
        });
    }
})();
