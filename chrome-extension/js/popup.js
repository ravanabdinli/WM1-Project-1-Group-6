const sections = {
  manualEntry: document.getElementById("manual-entry-section"),
  viewData: document.getElementById("view-data-section"),
  coverLetter: document.getElementById("cover-letter-section"),
};

// Navigation Buttons
document.getElementById("nav-view-data").addEventListener("click", () => showSection("viewData"));
document.getElementById("nav-manual-entry").addEventListener("click", () => showSection("manualEntry"));
document.getElementById("nav-cover-letter").addEventListener("click", () => showSection("coverLetter"));

// Show a specific section and hide others
function showSection(section) {
  Object.values(sections).forEach((s) => (s.style.display = "none"));
  sections[section].style.display = "block";

  if (section === "viewData") {
    loadSavedEntries();
  }
}

// Save data to chrome.storage.local
document.getElementById("data-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const entryName = document.getElementById("entryName").value;
  const data = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    dob: document.getElementById("dob").value,
    country: document.getElementById("country").value,
    city: document.getElementById("city").value,
    about: document.getElementById("about").value,
    contact: document.getElementById("contact").value,
  };

  chrome.storage.local.get("userEntries", (result) => {
    const userEntries = result.userEntries || {};
    userEntries[entryName] = data;

    chrome.storage.local.set({ userEntries }, () => {
      alert("Data saved successfully!");
      document.getElementById("data-form").reset();
    });
  });
});

// Load saved entries and display them in a list
function loadSavedEntries() {
  chrome.storage.local.get("userEntries", (result) => {
    const userEntries = result.userEntries || {};
    const savedEntriesList = document.getElementById("saved-entries");
    savedEntriesList.innerHTML = "";

    Object.keys(userEntries).forEach((entryName) => {
      const li = document.createElement("li");
      li.textContent = entryName;
      li.addEventListener("click", () => displayEntryData(entryName, userEntries[entryName]));
      savedEntriesList.appendChild(li);
    });

    if (Object.keys(userEntries).length === 0) {
      savedEntriesList.innerHTML = "<p>No saved entries found.</p>";
    }
  });
}

// Display the details of a specific entry
function displayEntryData(entryName, entryData) {
  const savedEntriesList = document.getElementById("saved-entries");
  savedEntriesList.innerHTML = `
    <h3>${entryName}</h3>
    <p><strong>First Name:</strong> ${entryData.firstName}</p>
    <p><strong>Last Name:</strong> ${entryData.lastName}</p>
    <p><strong>Date of Birth:</strong> ${entryData.dob}</p>
    <p><strong>Country:</strong> ${entryData.country}</p>
    <p><strong>City:</strong> ${entryData.city}</p>
    <p><strong>About:</strong> ${entryData.about}</p>
    <p><strong>Contact:</strong> ${entryData.contact}</p>
    <button id="back-to-list">Back to List</button>
  `;

  document.getElementById("back-to-list").addEventListener("click", loadSavedEntries);
}
