import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CareView from '../views/CareView.vue'
import BattleView from '../views/BattleView.vue'
import AboutView from '../views/AboutView.vue'
import AuthView from '../views/AuthView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/care', name: 'care', component: CareView },
    { path: '/battle', name: 'battle', component: BattleView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/auth', name: 'auth', component: AuthView },
  ],
})

export default router
