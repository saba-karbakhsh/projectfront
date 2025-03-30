const BASE_URL = "https://9040-142-232-153-30.ngrok-free.app";
// Assuming the user is already authenticated and the server is sending the required data during login
document.addEventListener('DOMContentLoaded', function () {
    let userId = localStorage.getItem('userID'); // Assuming userID is stored in localStorage after login
    const xhr2 = new XMLHttpRequest();
    xhr2.withCredentials = true; // Include credentials in the request
    xhr2.open("GET", "https://lionfish-app-kaw6i.ondigitalocean.app/api/v1/index?userID=" + userId, true); // Adjust the URL as needed
    xhr2.setRequestHeader("Content-Type", "application/json");
    xhr2.onreadystatechange = function () {
        if (xhr2.readyState === 4) {
            console.log("Response:", xhr2.responseText);
            if (xhr2.responseText.includes("API limit reached")) {
                alert("API limit reached. Please try again later.");
            }
            if (xhr2.status === 200) {
                let response = xhr2.responseText.trim();
                response = JSON.parse(response);
                if (response.message && response.message.toLowerCase().includes("session expired")) {
                    alert("Session expired. Please log in again.");
                    window.location.href = "login.html";
                    return;
                }
                localStorage.setItem("email", response.email);
                localStorage.setItem("role", response.role);
                localStorage.setItem("apiCounter", response.apiCounter);
                if (response.role === "admin") {
                    localStorage.setItem("usersData", JSON.stringify(response.usersData));
                    console.log("Users Data:", response.usersData); // Check the entire usersData object
                    localStorage.setItem("usersData", JSON.stringify(userData.usersData));
                    window.location.href = "admin.html";
                }

            }
        }
    };
    xhr2.send();
    // Fetch user data (email and API call count) from the server
    let email = localStorage.getItem('email');  // Assuming email is stored in localStorage after login
    let apiCounter = localStorage.getItem('apiCounter'); // Similarly, the API counter value is stored


    if (email && apiCounter !== null) {
        // Populate the data on the page
        document.getElementById('userEmail').textContent = email;
        document.getElementById('apiCounter').textContent = apiCounter;
    } else {
        // Handle case where there's no user info (user might have logged out or session expired)
        alert('User information not found. Please log in again.');
        window.location.href = 'login.html'; // Redirect to login page if no user data found
    }

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function () {
        // Clear localStorage (remove user session info)
        localStorage.removeItem('email');
        localStorage.removeItem('apiCounter');
        localStorage.removeItem('role');

        // Redirect to the login page
        window.location.href = 'login.html';
    });



});


// Function to send commands to the server
function sendCommand(command) {
    fetch(`${BASE_URL}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: command })
    })
        .then(response => console.log('Command sent:', command))
        .catch(error => console.error('Error:', error));
}

// Keyboard controls
document.addEventListener('keydown', function (event) {
    let command = '';
    switch (event.key) {
        case 'ArrowLeft': command = 'left'; break;
        case 'ArrowRight': command = 'right'; break;
        case 'ArrowUp': command = 'forward'; break;
        case 'ArrowDown': command = 'backward'; break;
        case 'w': command = 'up'; break;
        case 's': command = 'down'; break;
        case 'a': command = 'rotate_left'; break;
        case 'd': command = 'rotate_right'; break;
        case 'e': command = 'takeoff'; break;
        case 'q': command = 'land'; break;
    }
    if (command) {
        sendCommand(command);
        event.preventDefault(); // Prevent page scrolling with arrow keys
    }
});

// toggle face tracking
function toggleTracking() {
    fetch(`${BASE_URL}/toggle_tracking`)
        .then(response => response.json())
        .then(data => {
            const button = document.getElementById('trackingButton');
            button.innerText = data.tracking ? 'Stop Tracking' : 'Track Face';
        })
        .catch(error => console.error('Error:', error));
}