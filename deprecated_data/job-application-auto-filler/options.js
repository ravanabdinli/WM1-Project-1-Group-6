document.getElementById('save-profile').addEventListener('click', function() {
    const profileName = document.getElementById('profile-name').value;
    chrome.storage.sync.get('profiles', function(data) {
        let profiles = data.profiles || [];
        profiles.push({ name: profileName });
        chrome.storage.sync.set({ profiles: profiles });
    });
});