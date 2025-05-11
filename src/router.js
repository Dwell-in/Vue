import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MapView from '@/views/MapView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/map/:address',
    name: 'Map',
    component: MapView,
  },
]
const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
