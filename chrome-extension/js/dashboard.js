function loadApplications() {
    chrome.storage.local.get({ applications: [] }, (result) => {
      const applications = result.applications;
      const tableBody = $("#applications-table-body");
      tableBody.empty();
  
      applications.forEach((app) => {
        const row = `<tr>
          <td>${app.company}</td>
          <td>${app.jobTitle}</td>
          <td>${app.dateApplied}</td>
          <td>${app.status}</td>
        </tr>`;
        tableBody.append(row);
      });
    });
  }
  
  // Add a new application
  $("#application-form").submit((e) => {
    e.preventDefault();
  
    const application = {
      company: $("#company").val(),
      jobTitle: $("#jobTitle").val(),
      dateApplied: $("#dateApplied").val(),
      status: $("#status").val(),
    };
  
    chrome.storage.local.get({ applications: [] }, (result) => {
      const applications = result.applications;
      applications.push(application);
  
      chrome.storage.local.set({ applications }, () => {
        console.log("Application saved.");
        loadApplications();
      });
    });
  });
  