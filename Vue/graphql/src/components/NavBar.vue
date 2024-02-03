<template>
    <nav>
        <header class="block">
            <ul class="header-menu horizontal-list">
                <li>
                    <router-link class="header-menu-tab" to="/dashboard"><span
                            class="icon entypo-cog scnd-font-color"></span>Dashboard</router-link>
                </li>
                <li>
                    <router-link class="header-menu-tab" to="/profile"><span
                            class="icon fontawesome-star-empty scnd-font-color"></span>Profile</router-link>
                </li>
                <li>
                    <a href="#" target="_blank" class="header-menu-tab" to="/charts"><span
                    class="icon fontawesome-user scnd-font-color"></span>MyGraphiQL</a>
                </li>
                <li>
                    <a class="header-menu-tab" href="#"><span
                            class="icon fontawesome-envelope scnd-font-color"></span>Infos</a>
                    <div v-if="success" class="block">
                        <a class="header-menu-number" href="#4">{{ data.table }}</a>
                        <div class="dropdown-content">
                            <p>{{ data.registration.name }} starts in:</p>
                            <p id="countdown">{{ data.registration.countdown }}</p>
                        </div>
                    </div>
                    <div v-if="!success">
                        <a class="header-menu-number" href="#4">{{ }}</a>
                        <div class="dropdown-content">
                            <a href="#">No Events</a>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="profile-logout">
                <!-- <p>Me <a href="#26"><span class="entypo-down-open scnd-font-color"></span></a></p>
                    <div class="profile-picture small-profile-picture">
                    <img width="40px" alt="Anne Hathaway picture" src="http://upload.wikimedia.org/wikipedia/commons/e/e1/Anne_Hathaway_Face.jpg">
                </div> -->
                <div>
                    <router-link @click="handleLogout" to="/"><span class="entypo-down-open scnd-font-color"></span>Logout
                    </router-link>
                    <i class="fa fa-sign-out"></i>
                </div>
            </div>
            <div>
            </div>
        </header>
        <div class="navbar-default sidebar" role="navigation">
            <div class="sidebar-nav navbar-collapse">
                <ul class="nav" id="side-menu">
                </ul>
            </div>
        </div>
    </nav>
</template>
  
<script>
import { mapActions } from 'vuex';

export default {
    name: 'NavBar',
    data() {
        return {
            data: {},
            success: false
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        ...mapActions('auth', ['logout']),
        handleLogout() {
            this.logout();
        },
        formatTimeRemaining(milliseconds) {
            // Calculate the remaining time components
            const seconds = Math.floor(milliseconds / 1000) % 60;
            const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
            const hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
            const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

            // Construct the formatted time string
            let formattedTime = '';
            if (days > 0) {
                formattedTime += `${days}d `;
            }
            if (hours > 0) {
                formattedTime += `${hours}h `;
            }
            if (minutes > 0) {
                formattedTime += `${minutes}m `;
            }
            formattedTime += `${seconds}s`;

            return formattedTime;
        },
        async fetchData() {
            const graphqlQuery = `query {
                registration_user {
                    registration {
                        attrs
                        path
                        __typename
                        endAt
                    }
                }
                registration  {
                    path
                    __typename
                    endAt
                    eventStartAt
                }
            }`;
            try {
                const response = await fetch('https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwtoken')}`
                    },
                    body: JSON.stringify({ query: graphqlQuery })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const jsonData = await response.json();

                let upcoming_first = 0
                let upcoming_first_found
                let name
                for (let index = 0; index < jsonData.data.registration.length; index++) {
                    const element = new Date(jsonData.data.registration[index].eventStartAt).getTime();

                    if (element >= Date.now()) {
                        if (upcoming_first != 0 && element - Date.now() < upcoming_first) {
                            upcoming_first = element - Date.now()
                            upcoming_first_found = element
                            let path = jsonData.data.registration[index].path.split('/')
                            name = path[path.length - 1]
                        } else if (upcoming_first == 0) {
                            upcoming_first = element - Date.now()
                            upcoming_first_found = element
                            let path = jsonData.data.registration[index].path.split('/')
                            name = path[path.length - 1]
                        }
                    }
                }
                this.data = {}
                this.data["registration"] = { name: name, countdown: upcoming_first_found }

                if (this.data.registration.length != 0 || jsonData.data.registration.length != 0) {
                    this.success = true
                    this.data["table"] = Object.keys(this.data).length
                }
                this.startCountdown(this.data.registration.countdown)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        parseFormattedTime(formattedTime) {
            const parts = formattedTime.split(' '); // Split the formatted time string by spaces
            let milliseconds = 0;

            // Iterate over each part of the formatted time string
            parts.forEach(part => {
                // Extract the numerical value and the unit from each part
                const value = parseInt(part.slice(0, -1)); // Remove the last character (unit)
                const unit = part.slice(-1); // Get the last character (unit)

                // Convert each unit to milliseconds and add it to the total
                switch (unit) {
                    case 'd': // Days
                        milliseconds += value * 24 * 60 * 60 * 1000;
                        break;
                    case 'h': // Hours
                        milliseconds += value * 60 * 60 * 1000;
                        break;
                    case 'm': // Minutes
                        milliseconds += value * 60 * 1000;
                        break;
                    case 's': // Seconds
                        milliseconds += value * 1000;
                        break;
                    default:
                        console.error('Invalid unit:', unit);
                }
            });

            return milliseconds;
        },
        startCountdown(endTime) {
            const countdownInterval = setInterval(() => {
                let countdownElement = document.getElementById('countdown');

                if (countdownElement) {
                    const now = Date.now();
                    const updatedTimeDifference = endTime - now;
                    const formattedTimeRemaining = this.formatTimeRemaining(updatedTimeDifference);
                    countdownElement.textContent = formattedTimeRemaining;
                }
            }, 1000);
        }
    },
};
</script>
  
<style scoped></style>
  