function loadProfileList() {
    chrome.storage.local.get(['profileList'], function (result) {
        const profileSelect = document.getElementById('profileSelect');
        profileSelect.innerHTML = '<option value="">--Select Profile--</option>';
        if (result.profileList) {
            result.profileList.forEach(profile => {
                const option = document.createElement('option');
                option.value = profile;
                option.textContent = profile;
                profileSelect.appendChild(option);
            });
        }
    });
}
loadProfileList()
document.getElementById('profileSelect').addEventListener('change', loadSelectedProfile);
let profileData
function loadSelectedProfile() {
    const profileName = document.getElementById('profileSelect').value;
    if (profileName) {
        chrome.storage.local.get([profileName], function(result) {
            profileData = result[profileName];
            console.log(profileData)
        });
    } else {
        
    }
}

document.getElementById('generate').addEventListener('click', runAI)

async function runAI() {

    const genAI = new window.GoogleGenerativeAI(
        "AIzaSyD3V-F_kvKhOkDdgHX7w5OCS-oiMQJhCJs"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `print 5+5`;

    console.log(prompt)

    try {
        const result = await model.generateContent(prompt);

        // Extract the text from the AI response
        const aiOutput = result.response.text();

        console.log("Generated Response:", aiOutput);

        // Write the AI output to the textarea with id "coverLetter"
        const coverLetterTextarea = document.getElementById("cover_letter");
        if (coverLetterTextarea) {
            coverLetterTextarea.value = aiOutput; // Write response to textarea
        } else {
            console.error("Textarea with id 'coverLetter' not found.");
        }
        return; // Exit after a successful response
    } catch (error) {
        console.error("All retry attempts failed. Please try again later.");
    }
}