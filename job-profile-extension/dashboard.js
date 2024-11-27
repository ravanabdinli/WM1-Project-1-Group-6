document.addEventListener('DOMContentLoaded', function() {
    loadApplications();

    document.getElementById('addJobButton').addEventListener('click', addApplication);
    document.getElementById('backButton').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
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
