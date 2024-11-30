document.addEventListener('DOMContentLoaded', function () {
    loadSavedForms();

    document.getElementById('deleteAllButton').addEventListener('click', function () {
        chrome.storage.local.remove('savedFormData', function () {
            loadSavedForms();
            alert('All saved forms have been deleted.');
        });
    });
});

function loadSavedForms() {
    chrome.storage.local.get(['savedFormData'], function (result) {
        const savedFormsList = document.getElementById('savedFormsList');
        savedFormsList.innerHTML = '';

        if (result.savedFormData) {
            for (let key in result.savedFormData) {
                const formEntry = document.createElement('div');
                formEntry.innerText = `${key}: ${result.savedFormData[key]}`;
                savedFormsList.appendChild(formEntry);
            }
        } else {
            savedFormsList.innerText = 'No saved form data available.';
        }
    });
}
