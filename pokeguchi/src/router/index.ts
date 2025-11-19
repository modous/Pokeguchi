import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
    },
    {
      path: '/care',
      name: 'care',
      component: () => import('@/views/CareView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/battle',
      name: 'battle',
      component: () => import('@/views/BattleView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('@/views/InventoryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // haal huidige user op (via Supabase sessie)
  if (!auth.user) await auth.fetchUser()

  const isAuthenticated = !!auth.user

  // als route auth vereist en user niet is ingelogd
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth')
  }
  // als user al is ingelogd en probeert /auth te bezoeken
  else if (to.path === '/auth' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
