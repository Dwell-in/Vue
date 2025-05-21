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
    component: () => import('@/views/member/LoginView.vue'),
  },
  {
    path: '/member/signup',
    name: 'SignUp',
    component: () => import('@/views/member/SignUpView.vue'),
  },
  {
    path: '/member/password-find',
    name: 'passwordFine',
    component: () => import('@/views/member/PasswordFindView.vue'),
  },
  {
    path: '/board/list/:categoryId',
    name: 'Board',
    component: () => import('@/views/board/BoardListView.vue'),
  },
  {
    path: '/board/detail/:boardId/:categoryId',
    name: 'BoardDetail',
    component: () => import('@/views/board/BoardDetailView.vue'),
  },
  {
    path: '/board/write/:categoryId',
    name: 'BoardWrite',
    component: () => import('@/views/board/BoardWriteView.vue'),
  },
  {
    path: '/board/update/:boardId/:categoryId',
    name: 'BoardUpdate',
    component: () => import('@/views/board/BoardUpdateView.vue'),
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
    path: '/dwellog/:categoryId',
    name: 'Dwellog',
    component: () => import('./views/dwellog/DwellogListView.vue'),
  },
  {
    path: '/dwellog/:categoryId/:link',
    name: 'DwellogDetail',
    component: () => import('./views/dwellog/DwellogDetailView.vue'),
  },
  {
    path: '/property/regist',
    name: 'PropertyRegist',
    component: () => import('./views/PropertyRegisterView.vue'),
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
