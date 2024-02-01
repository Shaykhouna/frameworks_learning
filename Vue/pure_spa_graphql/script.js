document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    

    try {
        // Send authentication request to GraphQL server
        const response = await authenticateUser(username, password);
        
        if (response.error) {
            console.log(response.error)
        }
        if (response) {
            localStorage.setItem('token', response);
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid username or password');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});

// Encode the username and password to base64 & Send authentication request to GraphQL server
async function authenticateUser(username, password) {
     const encodedCredentials = btoa(`${username}:${password}`);

     const response = await fetch('https://learn.zone01dakar.sn/api/auth/signin', {
         method: 'POST',
         headers: {
             'Authorization': `Basic ${encodedCredentials}`,
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({ username, password })
     });
 
     return response.json();
}

// dashboard.html and dashboard.js will handle the dashboard functionality, including data fetching, display, and logout logic

