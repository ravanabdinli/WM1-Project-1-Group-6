const dataForm = document.getElementById("data-form");
const viewDataButton = document.getElementById("view-data");
const backToFormButton = document.getElementById("back-to-form");
const mainSection = document.getElementById("main-section");
const savedDataSection = document.getElementById("saved-data-section");
const savedDataDiv = document.getElementById("saved-data");

// Save data to chrome.storage.local
dataForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    dob: document.getElementById("dob").value,
    country: document.getElementById("country").value,
    city: document.getElementById("city").value,
    about: document.getElementById("about").value,
    contact: document.getElementById("contact").value,
  };

  chrome.storage.local.set({ userData: data }, () => {
    alert("Data saved successfully!");
    dataForm.reset();
  });
});

// Switch to the saved data view
viewDataButton.addEventListener("click", () => {
  chrome.storage.local.get("userData", (result) => {
    const data = result.userData;
    if (data) {
      savedDataDiv.innerHTML = `
        <p><strong>First Name:</strong> ${data.firstName}</p>
        <p><strong>Last Name:</strong> ${data.lastName}</p>
        <p><strong>Date of Birth:</strong> ${data.dob}</p>
        <p><strong>Country:</strong> ${data.country}</p>
        <p><strong>City:</strong> ${data.city}</p>
        <p><strong>About:</strong> ${data.about}</p>
        <p><strong>Contact:</strong> ${data.contact}</p>
        <button id="edit-data">Edit Data</button>
      `;
    } else {
      savedDataDiv.innerHTML = "<p>No data saved yet.</p>";
    }
    mainSection.style.display = "none";
    savedDataSection.style.display = "block";

    // Handle edit data button
    document.getElementById("edit-data")?.addEventListener("click", () => {
      mainSection.style.display = "block";
      savedDataSection.style.display = "none";
    });
  });
});

// Switch back to the data form
backToFormButton.addEventListener("click", () => {
  mainSection.style.display = "block";
  savedDataSection.style.display = "none";
});
