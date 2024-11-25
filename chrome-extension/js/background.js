chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed!');
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'saveHistory') {
      chrome.storage.local.get({ history: [] }, (result) => {
        const updatedHistory = [...result.history, message.data];
        chrome.storage.local.set({ history: updatedHistory }, () => {
          sendResponse({ status: 'History saved!' });
        });
      });
      return true; // Keep the message channel open for async responses
    }
  });
  