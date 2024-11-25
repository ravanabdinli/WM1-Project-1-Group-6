document.getElementById('generate').addEventListener('click', () => {
    // Get active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Request job details from content script
      chrome.tabs.sendMessage(tabs[0].id, { action: "getJobDetails" }, (response) => {
        if (response) {
          const { jobTitle, companyName } = response;
  
          // Send job details to background script for generating the cover letter
          chrome.runtime.sendMessage(
            { action: "generateCoverLetter", jobTitle, companyName },
            (result) => {
              document.getElementById('output').innerText = result.coverLetter;
            }
          );
        }
      });
    });
  });