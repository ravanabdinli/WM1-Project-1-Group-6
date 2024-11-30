document.addEventListener('DOMContentLoaded', function() {
    // Get the navigation buttons by their IDs
    const homeButton = document.getElementById('homeButton');
    const dashboardButton = document.getElementById('dashboardButton');
    const profilesButton = document.getElementById('profilesButton');
    const coverLetterButton = document.getElementById('coverLetterButton');

    // Add event listeners to link the pages when clicked
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            window.location.href = 'home.html'; // Link to Home page
        });
    }

    if (dashboardButton) {
        dashboardButton.addEventListener('click', function() {
            window.location.href = 'dashboard.html'; // Link to Dashboard
        });
    }

    if (profilesButton) {
        profilesButton.addEventListener('click', function() {
            window.location.href = 'index.html'; // Link to Profiles
        });
    }

    if (coverLetterButton) {
        coverLetterButton.addEventListener('click', function() {
            window.location.href = 'cover_letter.html'; // Link to Cover Letter Generator page
        });
    }
});
