// Load profiles into dropdown
function loadProfiles() {
    chrome.storage.local.get({ profiles: {} }, (result) => {
      const profiles = result.profiles;
      const profileDropdown = $("#profile-dropdown");
      profileDropdown.empty();
  
      for (const [name, data] of Object.entries(profiles)) {
        profileDropdown.append(new Option(name, name));
      }
    });
  }
  
  // Save a new profile
  function saveProfile(profileName, profileData) {
    chrome.storage.local.get({ profiles: {} }, (result) => {
      const profiles = result.profiles;
      profiles[profileName] = profileData;
  
      chrome.storage.local.set({ profiles }, () => {
        console.log("Profile saved:", profileName);
        loadProfiles();
      });
    });
  }
  
  // Switch profile
  $("#profile-dropdown").change(() => {
    const selectedProfile = $("#profile-dropdown").val();
    console.log("Profile switched to:", selectedProfile);
  });
  