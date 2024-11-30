document.addEventListener('DOMContentLoaded', function() {
    loadApplications();

    document.getElementById('addJobButton').addEventListener('click', addApplication);
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // Applying additional styles to dropdowns
    styleDropdowns();
});

function loadApplications() {
    chrome.storage.local.get(['jobApplications'], function(result) {
        const tbody = document.getElementById('applicationTable').querySelector('tbody');
        tbody.innerHTML = '';
        if (result.jobApplications) {
            result.jobApplications.forEach((application, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${application.company}</td>
                    <td>${application.jobTitle}</td>
                    <td>${application.dateApplied}</td>
                    <td>
                        <select class="statusDropdown" data-index="${index}">
                            <option value="Applied" ${application.status === 'Applied' ? 'selected' : ''}>Applied</option>
                            <option value="Interviewing" ${application.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                            <option value="Offer Received" ${application.status === 'Offer Received' ? 'selected' : ''}>Offer Received</option>
                            <option value="Rejected" ${application.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                            <option value="On Hold" ${application.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
                        </select>
                    </td>
                `;
                tbody.appendChild(row);
            });

            // Add event listeners to each status dropdown
            const dropdowns = document.querySelectorAll('.statusDropdown');
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('change', updateStatus);
            });
        }
    });
}

function addApplication() {
    const company = document.getElementById('company').value;
    const jobTitle = document.getElementById('jobTitle').value;
    const dateApplied = document.getElementById('dateApplied').value;
    const status = document.getElementById('status').value;

    if (!company || !jobTitle || !dateApplied || !status) {
        alert('Please fill out all fields.');
        return;
    }

    const newApplication = { company, jobTitle, dateApplied, status };

    chrome.storage.local.get(['jobApplications'], function(result) {
        let jobApplications = result.jobApplications || [];
        jobApplications.push(newApplication);
        chrome.storage.local.set({ jobApplications }, function() {
            loadApplications();
            alert('Job application added successfully!');
        });
    });
}

function updateStatus(event) {
    const dropdown = event.target;
    const index = dropdown.getAttribute('data-index');
    const newStatus = dropdown.value;

    chrome.storage.local.get(['jobApplications'], function(result) {
        let jobApplications = result.jobApplications || [];
        if (jobApplications[index]) {
            jobApplications[index].status = newStatus;
            chrome.storage.local.set({ jobApplications }, function() {
                alert('Job application status updated successfully!');
            });
        }
    });
}

// Function to style dropdowns (additional styling if needed dynamically)
function styleDropdowns() {
    const dropdowns = document.querySelectorAll('select');
    dropdowns.forEach(dropdown => {
        dropdown.style.width = "100%";
        dropdown.style.padding = "8px";
        dropdown.style.borderRadius = "5px";
        dropdown.style.border = "1px solid #ccc";
        dropdown.style.backgroundColor = "#f9f9f9";
        dropdown.style.fontSize = "1em";
        dropdown.style.cursor = "pointer";
        dropdown.style.color = "#333";

        dropdown.addEventListener('focus', function() {
            dropdown.style.borderColor = "#007BFF";
        });
        dropdown.addEventListener('blur', function() {
            dropdown.style.borderColor = "#ccc";
        });
    });
}


function loadApplications() {
    chrome.storage.local.get(['jobApplications'], function (result) {
        const tbody = document.getElementById('applicationTable').querySelector('tbody');
        tbody.innerHTML = '';
        if (result.jobApplications) {
            result.jobApplications.forEach((application, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${application.company}</td>
                    <td>${application.jobTitle}</td>
                    <td>${application.dateApplied}</td>
                    <td>
                        <select class="statusDropdown" data-index="${index}">
                            <option value="Applied" ${application.status === 'Applied' ? 'selected' : ''}>Applied</option>
                            <option value="Interviewing" ${application.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                            <option value="Offer Received" ${application.status === 'Offer Received' ? 'selected' : ''}>Offer Received</option>
                            <option value="Rejected" ${application.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                            <option value="On Hold" ${application.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
                        </select>
                    </td>
                    <td>
                        <button class="deleteRowButton" data-index="${index}" style="background-color: red; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                            X
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            // Add event listeners to each status dropdown
            const dropdowns = document.querySelectorAll('.statusDropdown');
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('change', updateStatus);
            });

            // Add event listeners to each delete button
            const deleteButtons = document.querySelectorAll('.deleteRowButton');
            deleteButtons.forEach(button => {
                button.addEventListener('click', deleteApplication);
            });
        }
    });
}

function deleteApplication(event) {
    const index = event.target.getAttribute('data-index');

    chrome.storage.local.get(['jobApplications'], function (result) {
        let jobApplications = result.jobApplications || [];
        if (jobApplications[index]) {
            jobApplications.splice(index, 1);
            chrome.storage.local.set({ jobApplications }, function () {
                loadApplications();
                alert('Job application deleted successfully!');
            });
        } else {
            alert('Failed to delete the application. The row could not be found.');
        }
    });
}
