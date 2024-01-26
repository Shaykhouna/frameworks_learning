import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
   path: '/dashboard',
   name: 'Home',
   component: () => import('@/views/Home.vue'),
 },
 {
   path: '/login',
   name: 'Login',
   // route level code-splitting
   // this generates a separate chunk (login.[hash].js) for this route
   // which is lazy-loaded when the route is visited.
   component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
 },
 {
   path: '/',
   name: 'Register',
   // route level code-splitting
   // this generates a separate chunk (register.[hash].js) for this route
   // which is lazy-loaded when the route is visited.
   component: () => import(/* webpackChunkName: "register" */ '@/views/Register.vue')
 },
//  {
//    path: '*',
//    redirect: 'login'
//  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router