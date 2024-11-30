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

loadProfileList();

document.getElementById('profileSelect').addEventListener('change', loadSelectedProfile);
let profileData;

function loadSelectedProfile() {
    const profileName = document.getElementById('profileSelect').value;
    if (profileName) {
        chrome.storage.local.get([profileName], function(result) {
            profileData = result[profileName];
            console.log(profileData);
        });
    } else {
        profileData = null;
    }
}
//EventTarget: addEventListener() method - Web APIs | MDN. MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
document.getElementById('generate').addEventListener('click', runAI);

async function runAI() { // This function generates a cover letter based on the selected profile’s information using Google’s Generative AI.
    if (!profileData) {
        console.error("No profile data loaded");
        return;
    }

    const genAI = new window.GoogleGenerativeAI(
        "AIzaSyD3V-F_kvKhOkDdgHX7w5OCS-oiMQJhCJs" // OpenAI. (Nov 26, 2024). ChatGPT [Large language model]. https://chatgpt.com
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); //The code initializes a connection to Google's Generative AI service using an API key and selects the "gemini-1.5-pro" model for generating AI outputs, such as text or other content.

    const prompt = `Write a professional cover letter for a job application. The name of the applicant is ${profileData.firstName} ${profileData.lastName}. 
They have experience in ${profileData.experience}, and their skills include ${profileData.skills}. 
Their country of residence is ${profileData.country} and city of residence is ${profileData.city}. 
Here is a summary of their qualifications: ${profileData.aboutMe}. 
They have received education in ${profileData.education}, and their portfolio can be viewed at ${profileData.portfolio}.
`;

    console.log(prompt);

    try { //OpenAI. (Nov 27, 2024). ChatGPT [Large language model]. https://chatgpt.com
        const result = await model.generateContent(prompt);

        // Extract the text from the AI response
        const aiOutput = result.response.text();

        console.log("Generated Response:", aiOutput);
        const coverLetterTextarea = document.getElementById("cover_letter");
        if (coverLetterTextarea) {
            coverLetterTextarea.value = aiOutput; 
        } else {
            console.error("Textarea with id 'cover_letter' not found.");
        }
        return; 
    } catch (error) {
        console.error("All retry attempts failed. Please try again later.");
    }
}
