import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MapView from '@/views/MapView.vue'
import LoginView from './views/LoginView.vue'
import SignUpView from './views/SignUpView.vue'
import PasswordFindView from './views/PasswordFindView.vue'
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
    path: '/member/password-find',
    name: 'passwordFine',
    component: PasswordFindView,
  },
  {
    path: '/board/list',
    name: 'Board',
    component: BoardView,
  },
  {
    path: '/board/post-detail',
    name: 'PostDetail',
    component: () => import('@/components/board/PostDetail.vue'),
  },
  {
    path: '/board/post-write',
    name: 'PostWrite',
    component: () => import('@/components/board/PostWrite.vue'),
  },
  {
    path: '/board/post-update',
    name: 'PostUpdate',
    component: () => import('@/components/board/PostUpdate.vue'),
  },
  {
    path: '/email/verify',
    name: 'EmailVerify',
    component: () => import('@/components/member/EmailVerify.vue'),
  },
]
const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
