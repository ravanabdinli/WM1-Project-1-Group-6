(function () {
    console.log('Content script')

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

    function fillFormData(savedData) {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (savedData[input.name]) {
                input.value = savedData[input.name];
            }
        });
    }

   //EventTarget: addEventListener() method - Web APIs | MDN. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    // W3Schools. (n.d.). HTML DOM addEventListener() Method (from https://www.w3schools.com/js/js_htmldom_eventlistener.asp).
    saveButton.addEventListener('click', function () {
        const formData = getFormData();
        chrome.storage.local.set({ 'savedWebFormData': formData }, function () {
            alert('Form data saved successfully!');
        });
    });

   //EventTarget: addEventListener() method - Web APIs | MDN. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener 
   //W3Schools. (n.d.). HTML DOM addEventListener() Method (from https://www.w3schools.com/js/js_htmldom_eventlistener.asp).
    loadButton.addEventListener('click', function () {
        chrome.storage.local.get(['savedWebFormData'], function (result) {
            if (result.savedWebFormData) {
                fillFormData(result.savedWebFormData);
                alert('Form data loaded successfully!');
            } else {
                alert('No saved form data found.');
            }
        });
    });
})();

