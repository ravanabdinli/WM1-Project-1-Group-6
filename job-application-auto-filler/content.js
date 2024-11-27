chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillForm") {
        // logic to fill forms using LinkedIn extracted data.
    }
});