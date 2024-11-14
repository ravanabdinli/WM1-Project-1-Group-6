function fetchPositionInfo() {
    let positionTitle = document.querySelector('.job-title')?.innerText || "Position Title";
    let employerName = document.querySelector('.company-name')?.innerText || "Employer Name";
  
    return { positionTitle, employerName };
}

chrome.runtime.onMessage.addListener((req, sndr, reply) => {
    if (req.action === "retrievePositionInfo") {
        reply(fetchPositionInfo());
    }
});