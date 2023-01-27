// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        meta: {
          auth: true
        },
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/login',
        name: 'Login',
        meta: {
          auth: false
        },
        component: () => import('@/views/Login.vue'),
      },
      {
        path: '/registration',
        name: 'Registration',
        meta: {
          auth: false
        },
        component: () => import('@/views/Registration'),
      },
    ],
  },
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('expenseToken');
  if (to.meta.auth && !isAuthenticated) {
    next({ path: '/login' });
  } else {
    next();
  }
})

export default router
