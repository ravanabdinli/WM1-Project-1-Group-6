document.addEventListener('DOMContentLoaded', function () {
    $('#fillForm').click(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: autoFillForm
            });
        });
    });

    function autoFillForm() {
        // Sample code to fill a form on the active tab.
        document.querySelector('input[name="fullName"]').value = "John Doe";
        document.querySelector('input[name="email"]').value = "john.doe@example.com";
    }
});
