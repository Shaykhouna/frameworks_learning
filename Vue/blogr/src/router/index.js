import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/dashboard',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (login.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  // {
  //   path: '/register',
  //   name: 'Register',
  //   // route level code-splitting
  //   // this generates a separate chunk (register.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "register" */ '@/views/Register.vue')
  // },
  {
    path: '*',
    redirect: 'login'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // Check if the user is logged i
const isUserLoggedIn = store.getters.isAuthenticated
if (to.matched.some(record => record.meta.requiresAuth)) {
  if (!isUserLoggedIn) {
    store.dispatch('logOut')
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
} else {
  next()
}
})

export default router
