const profileSelector = document.getElementById('profile-selector');

// Load profiles on popup open
chrome.storage.local.get('profiles', ({ profiles }) => {
  if (!profiles) profiles = {};
  Object.keys(profiles).forEach(profile => {
    const option = document.createElement('option');
    option.value = profile;
    option.textContent = profile;
    profileSelector.appendChild(option);
  });
});

// Save data to a selected profile
document.getElementById('save-button').addEventListener('click', () => {
  const selectedProfile = profileSelector.value;
  if (!selectedProfile) return alert('Please select or create a profile.');

  const formData = {
    firstName: document.getElementById('first-name').value,
    lastName: document.getElementById('last-name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    skills: document.getElementById('skills').value,
    address: document.getElementById('address').value,
    dob: document.getElementById('dob').value,
    country: document.getElementById('country').value,
    city: document.getElementById('city').value,
    about: document.getElementById('about').value,
    education: document.getElementById('education').value,
    portfolio: document.getElementById('portfolio').value
  };

  chrome.storage.local.get('profiles', ({ profiles }) => {
    if (!profiles) profiles = {};
    profiles[selectedProfile] = formData;

    chrome.storage.local.set({ profiles }, () => {
      alert(`Data saved for profile: ${selectedProfile}`);
    });
  });
});

// Fill form on the current page
document.getElementById('fill-button').addEventListener('click', async () => {
  const selectedProfile = profileSelector.value;
  if (!selectedProfile) return alert('Please select a profile.');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: fillForm,
    args: [selectedProfile]
  });
});

function fillForm(profile) {
  chrome.storage.local.get('profiles', ({ profiles }) => {
    if (!profiles || !profiles[profile]) {
      return alert('Profile data not found!');
    }
    const formData = profiles[profile];
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      const name = input.name || input.id;
      if (formData[name]) input.value = formData[name];
    });
  });
}

// Add new profile
document.getElementById('new-profile').addEventListener('click', () => {
  const profileName = prompt('Enter profile name:');
  if (!profileName) return;

  chrome.storage.local.get('profiles', ({ profiles }) => {
    if (!profiles) profiles = {};
    if (profiles[profileName]) return alert('Profile already exists.');

    profiles[profileName] = {}; // Empty profile
    chrome.storage.local.set({ profiles }, () => {
      const option = document.createElement('option');
      option.value = profileName;
      option.textContent = profileName;
      profileSelector.appendChild(option);
      alert('Profile created successfully!');
    });
  });
});

// Delete profile
document.getElementById('delete-profile').addEventListener('click', () => {
  const selectedProfile = profileSelector.value;
  if (!selectedProfile) return alert('Please select a profile to delete.');

  chrome.storage.local.get('profiles', ({ profiles }) => {
    if (!profiles || !profiles[selectedProfile]) return alert('Profile not found.');

    delete profiles[selectedProfile];
    chrome.storage.local.set({ profiles }, () => {
      const options = Array.from(profileSelector.options);
      options.forEach(option => {
        if (option.value === selectedProfile) option.remove();
      });
      alert(`Profile "${selectedProfile}" deleted successfully.`);
    });
  });
});

// Export data
document.getElementById('export-button').addEventListener('click', () => {
  chrome.storage.local.get('profiles', ({ profiles }) => {
    const blob = new Blob([JSON.stringify(profiles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profiles.json';
    a.click();
    URL.revokeObjectURL(url);
  });
});

// Import data
document.getElementById('import-button').addEventListener('click', () => {
  const fileInput = document.getElementById('import-file');
  const file = fileInput.files[0];
  if (!file) return alert('Please select a file to import.');

  const reader = new FileReader();
  reader.onload = () => {
    const importedData = JSON.parse(reader.result);
    chrome.storage.local.set({ profiles: importedData }, () => {
      alert('Profiles imported successfully!');
      location.reload();
    });
  };
  reader.readAsText(file);
});
