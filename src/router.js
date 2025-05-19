import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/map/:address',
    name: 'Map',
    component: () => import('@/views/MapView.vue'),
  },
  {
    path: '/member/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/member/signup',
    name: 'SignUp',
    component: () => import('@/views/SignUpView.vue'),
  },
  {
    path: '/member/password-find',
    name: 'passwordFine',
    component: () => import('@/views/PasswordFindView.vue'),
  },
  {
    path: '/board/list/:categoryId',
    name: 'Board',
    component: () => import('@/views/BoardListView.vue'),
  },
  {
    path: '/board/detail/:boardId/:categoryId',
    name: 'BoardDetail',
    component: () => import('@/views/BoardDetailView.vue'),
  },
  {
    path: '/board/write/:categoryId',
    name: 'BoardWrite',
    component: () => import('@/views/BoardWriteView.vue'),
  },
    {
    path: '/board/update/:boardId/:categoryId',
    name: 'BoardUpdate',
    component: () => import('@/views/BoardUpdateView.vue'),
  },
  {
    path: '/email/verify',
    name: 'EmailVerify',
    component: () => import('@/components/member/EmailVerify.vue'),
  },
  {
    path: '/starred/list',
    name: 'Starred',
    component: () => import('@/views/StarredView.vue'),
  },

  {
    path: '/error/:code',
    name: 'ErrorPage',
    component: () => import('@/views/ErrorView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/error/404',
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
