import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MapView from '@/views/MapView.vue'
import LoginView from './views/LoginView.vue'
import SignUpView from './views/SignUpView.vue'
import BoardView from './views/BoardView.vue'

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
  {
    path: '/member/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/member/signup',
    name: 'SignUp',
    component: SignUpView,
  },
  {
    path: '/board',
    name: 'Board',
    component: BoardView,
  },
]
const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
