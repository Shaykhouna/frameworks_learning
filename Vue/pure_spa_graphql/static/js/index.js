import Dashboard from "./views/Dashboard.js";
import Profile from "./views/Profile.js";
import Error from "./views/Error.js";

export function cleaningSession() {
    document.cookie = "token; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/server; secure; "
    sessionStorage.clear()
    localStorage.clear()
  }

async function checkCookie() {
    let session = await isSessionAvailable()
  
    if (session) {
      const currentUrl = window.location.href
      const url = currentUrl.split("localhost:8080")
      if (url[1] == "/") {
        url[1] = "/home"
      }
      redirecTo(url[1])
    } else {
      cleaningSession()
      redirecTo("/")
    }
  };

  export async function isSessionAvailable() {
  
    try {
        const resp = await fetch("https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('tokenjwt')}`
            },
            body: JSON.stringify({ query: `query {
                    user {
                      id
                    }
            }` })
  
        });
  
        const data = await resp.json()

        console.log(data)
  
        if (data.error) {
          cleaningSession()
          console.log(data.error)
          return false
        } else {
          return true
        }
      } catch (error) {
        cleaningSession()
        console.error("Error details:", error.message);
        return false
      }
  }

export const redirecTo = async (url, data) => {
    const sessionCheck = await isSessionAvailable()
  
    if (!sessionCheck) {
      login()
    } else {
      history.pushState(data, null, url);
      router(data)
    }
}

export const router = async (data) => {
    const routes = [
      { path: "/dashboard", view: Dashboard },
      { path: "/profile", view: Profile },
      { path: "/error", view: Error }
    ];
    
    if (location.pathname === "/") {
      login()
    } else {
      const routeMatches = routes.map(route => {
        return {
          route: route,
          isAvailable: location.pathname === route.path
        }
      });

      let match = routeMatches.find(foundRoute => foundRoute.isAvailable) || { route: routes[2], isAvailable: true };

      const view = new match.route.view()
      document.body.innerHTML = await view.getHtml(data);
    }
  }

document.addEventListener("DOMContentLoaded", () => {
  checkCookie()
});

window.addEventListener("popstate", () => {
  checkCookie
});

function login() {
    // Create a div element with id "app"
    const appDiv = document.createElement('div');
    appDiv.id = 'app';

    // Create an h1 element for the login title
    const loginTitle = document.createElement('h1');
    loginTitle.textContent = 'Login';

    // Create a form element with id "loginForm"
    const loginForm = document.createElement('form');
    loginForm.id = 'loginForm';

    // Create an input element for the username field
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username';
    usernameInput.placeholder = 'Username';

    // Create an input element for the password field
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.placeholder = 'Password';

    // Create a button element for the login button
    const loginButton = document.createElement('button');
    loginButton.type = 'submit';
    loginButton.textContent = 'Login';

    // Append input elements to the form element
    loginForm.appendChild(usernameInput);
    loginForm.appendChild(passwordInput);
    loginForm.appendChild(loginButton);

    // Append login title and form to the app div
    appDiv.appendChild(loginTitle);
    appDiv.appendChild(loginForm);

    // Append the app div to the body of the document
    document.body.appendChild(appDiv);

    // Add event listener to the form submit event
    loginForm.addEventListener('submit', async function(event) {
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
                localStorage.setItem('tokenjwt', response);
                redirecTo("/dashboard")
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
}

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



// const navigateTo = url => {
//     history.pushState(null, null, url);
//     router();
// }

// const router = async () => {
//     const routes = [
//         { path: "/", view: Login },
//         { path: "/dashboard", view: Dashboard },
//         { path: "/profile", view: Profile },
//         // { path: "/errors", view: () => console.log("Viewing Errors") },
//     ];

//     const potentialMatches = routes.map(route => {
//         return {
//             route: route,
//             isMatch: location.pathname === route.path
//         }
//     })

//     let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

//     if (!match) {
//         match = {
//             route: routes[3],
//             isMatch:true
//         }
//     }

//     const view = new match.route.view()

//     document.querySelector("#app").innerHTML = await view.getHtml();

//     // console.log(match.route.view());
// };

// window.addEventListener("popstate", router);

// document.addEventListener("DOMContentLoaded", () => {
//     document.body.addEventListener("click", e => {
//         if (e.target.matches("[data-link]")) {
//             e.preventDefault();
//             navigateTo(e.target.href);
//         }
//     })
//     router()
// })
