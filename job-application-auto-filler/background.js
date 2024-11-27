chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ profiles: [] });
    console.log("Auto Form Filler Installed.");
}); 