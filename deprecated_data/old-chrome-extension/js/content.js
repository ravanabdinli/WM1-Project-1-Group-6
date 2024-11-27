// Add a floating button with an office bag icon
const addFloatingButton = () => {
  const button = document.createElement("button");
  button.id = "autofill-button";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "9999";
  button.style.backgroundColor = "transparent";
  button.style.border = "none";
  button.style.borderRadius = "50%";
  button.style.width = "60px";
  button.style.height = "60px";
  button.style.backgroundImage = "url('/icons/office-bag.png')";
  button.style.backgroundSize = "cover";
  button.style.cursor = "pointer";
  document.body.appendChild(button);

  // Add event listener for autofill
  button.addEventListener("click", () => {
    chrome.storage.local.get("userData", (result) => {
      const data = result.userData;
      if (data) {
        document.querySelectorAll("input").forEach((input) => {
          const name = input.name.toLowerCase();
          if (name.includes("first") && data.firstName) input.value = data.firstName;
          if (name.includes("last") && data.lastName) input.value = data.lastName;
          if (name.includes("dob") && data.dob) input.value = data.dob;
          if (name.includes("country") && data.country) input.value = data.country;
          if (name.includes("city") && data.city) input.value = data.city;
          if (name.includes("contact") && data.contact) input.value = data.contact;
        });
        alert("Form fields autofilled!");
      } else {
        alert("No data found. Please save your data first.");
      }
    });
  });
};

// Inject the button only if there are input fields
if (document.querySelectorAll("input").length > 0) {
  addFloatingButton();
}
