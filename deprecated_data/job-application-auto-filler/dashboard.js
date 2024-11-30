chrome.storage.sync.get('applications', function(data) {
    const applications = data.applications || [];
    const tableBody = document.getElementById('applications-table').getElementsByTagName('tbody')[0];
    applications.forEach(application => {
        let row = tableBody.insertRow();
        row.insertCell(0).innerText = application.company;
        row.insertCell(1).innerText = application.jobTitle;
        row.insertCell(2).innerText = application.dateApplied;
        row.insertCell(3).innerText = application.status;
    });
});         