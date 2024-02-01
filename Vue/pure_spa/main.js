import Vue from 'https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.esm.browser.min.js'
// import { createRouter, createWebHistory } from 'https://cdn.jsdelivr.net/npm/vue-router@latest/dist/vue.esm.browser.min.js';
// import { createApp } from 'https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.esm-browser.min.js';


import {
    Navbar
} from './components/navbar.js'

import {
    MainTemplate
} from './templates/main-template.js'

import {
    Login
} from './components/login.js'

Vue.use(VueRouter)

// const router = createRouter({
//     history: createWebHistory(),
//     routes: [{
//         path: '/login',
//         component: Login,
//         name: "Login Page"
//     }]
// })

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/dashboard',
            name: 'Home',
            component: Dashboard,
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            component: Login,
            name: "Login Page"
        },
        {
            path: '*',
            redirect: '/login'
        }
    ]
  })

new Vue({
    el: '#app',
    components: {
        'navbar': Navbar
    },
    router,
    template: MainTemplate
})