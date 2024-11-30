// contentScript.js
(function () {

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'formButtonContainer';

    const saveButton = document.createElement('button');
    const loadButton = document.createElement('button');
    saveButton.innerText = 'Save Current Form';
    loadButton.innerText = 'Load Saved Form';
    saveButton.id = 'saveFormButton';
    loadButton.id = 'loadFormButton';

    // Style the container for a vertical layout
    buttonContainer.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column; /* Vertical layout */
        gap: 10px;
    `;

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

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(loadButton);

  // W3Schools. (n.d.). HTML DOM addEventListener() Method (from https://www.w3schools.com/js/js_htmldom_eventlistener.asp).
    saveButton.addEventListener('click', saveCurrentForm);
    loadButton.addEventListener('click', loadSavedForm);

    function saveCurrentForm() {
        const formElements = document.querySelectorAll('input, select, textarea');
        const formData = {};
        formElements.forEach(element => {
            if (element.name) {
                formData[element.name] = element.value;
            }
        });
       
//Santamaría, P. (2022, February 23). Chrome extensions: Local storage. DEV Community. https://dev.to/paulasantamaria/chrome-extensions-local-storage-1b34
        chrome.storage.local.set({ 'savedFormData': formData }, function () {
            alert('Form data saved successfully!');

        });
    }

    function loadSavedForm() {
       
// Santamaría, P. (2022, February 23). Chrome extensions: Local storage. DEV Community. https://dev.to/paulasantamaria/chrome-extensions-local-storage-1b34
        chrome.storage.local.get(['savedFormData'], function (result) {
            const savedFormData = result.savedFormData;

            if (savedFormData) {
                const formElements = document.querySelectorAll('input, select, textarea');
                formElements.forEach(element => {
                    if (savedFormData[element.name] !== undefined) {
                        element.value = savedFormData[element.name];
                        element.dispatchEvent(new Event("input", { bubbles: true })); // "bubbles: true" lets the event reach parent elements, so their event listeners can respond to it.
                        element.dispatchEvent(new Event("change", { bubbles: true })); // W3Schools.com. (n.d.-b). https://www.w3schools.com/jsref/event_bubbles.asp
                    }
                });
                alert('Form data loaded successfully!');
            } else {
                alert('No saved form data found.');
            }
        });
    }

    if (window.location.href.includes('https://www.linkedin.com/in/')) {
        const grabData = document.createElement('button');
        grabData.innerText = 'Fetch LinkedIn Data';
        grabData.style.position = 'fixed';
        grabData.style.bottom = '120px'; 
        grabData.style.right = '20px'; 
        grabData.style.zIndex = 1001; 
        grabData.style.padding = '10px 15px';
        grabData.style.backgroundColor = 'white'; 
        grabData.style.color = '#000435'; 
        grabData.style.cursor = 'pointer';
        grabData.style.borderRadius = '20px'; 
        grabData.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.3)'; // W3Schools.com. (n.d.-c). https://www.w3schools.com/jsref/prop_style_boxshadow.asp
        grabData.style.fontWeight = 'bolder'; 
        
        
    
        buttonContainer.appendChild(grabData);

       // W3Schools. (n.d.). HTML DOM addEventListener() Method (from https://www.w3schools.com/js/js_htmldom_eventlistener.asp).
        grabData.addEventListener('click', function () {
            const firstname = document.querySelector('.GOeJUcPFHkspaBiXAWYmOCUxFmlczdTkRE.inline.t-24.v-align-middle.break-words').textContent.trim().split(' ')[0]
            const lastname = document.querySelector('.GOeJUcPFHkspaBiXAWYmOCUxFmlczdTkRE.inline.t-24.v-align-middle.break-words').textContent.trim().split(' ')[1]
            const about = document.querySelector('.woNafCXFRWaetclMApKuLdKrekntWTXdk span:nth-child(1)').textContent.trim()
            console.log(firstname)
            console.log(lastname)
            console.log(about)
            const user = { firstname: firstname, lastname: lastname, about: about }
            chrome.storage.local.set({ userData: user }, function () { // Santamaría, P. (2022, February 23). Chrome extensions: Local storage. DEV Community. https://dev.to/paulasantamaria/chrome-extensions-local-storage-1b34
                console.log("User data saved:", user);
                alert('Data has been fetched from LinkedIn. Open extension to see your data.');
            });
        })

    }

    document.body.appendChild(buttonContainer);

})();
