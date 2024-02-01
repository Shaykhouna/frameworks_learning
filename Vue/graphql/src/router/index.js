import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    beforeEnter: (to, from, next) => {
      const isAuthenticated = store.getters['auth/isAuthenticated'];
      if (isAuthenticated) {
        next('/dashboard'); // Redirect to dashboard if user is authenticated
      } else {
        next(); // Proceed to login page
      }
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue'),
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      const isAuthenticated = store.getters['auth/isAuthenticated'];
      if (!isAuthenticated) {
        next('/');
      } else {
        next();
      }
    },
  },
  {
    path: '/charts',
    name: 'charts',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Charts.vue'),
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      const isAuthenticated = store.getters['auth/isAuthenticated'];
      if (!isAuthenticated) {
        next('/');
      } else {
        next();
      }
    },
  },
  {
    path: '/profile',
    name: 'profile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Profile.vue'),
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      const isAuthenticated = store.getters['auth/isAuthenticated'];
      if (!isAuthenticated) {
        next('/');
      } else {
        next();
      }
    }
  },
  {
    path: '/:catchAll(.*)', // Define catch-all route with custom regexp parameter
    redirect: () => {
      const isAuthenticated = store.getters['auth/isAuthenticated'];
      console.log(isAuthenticated)
      return isAuthenticated ? '/dashboard' : '/'; // Redirect to dashboard if authenticated, otherwise redirect to login
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/isAuthenticated']) {
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
