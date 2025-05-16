import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MapView from '@/views/MapView.vue'
import LoginView from './views/LoginView.vue'
import SignUpView from './views/SignUpView.vue'
import PasswordFindView from './views/PasswordFindView.vue'
import BoardListView from './views/BoardListView.vue'
import BoardDetailView from './views/BoardDetailView.vue'
import BoardWriteView from './views/BoardWriteView.vue'
import StarredView from './views/StarredView.vue'

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
    path: '/board/list/:categoryId',
    name: 'Board',
    component: BoardListView,
  },
  {
    path: '/board/detail/:boardId/:categoryId',
    name: 'BoardDetail',
    component: BoardDetailView,
  },
  {
    path: '/board/write/:categoryId',
    name: 'BoardWrite',
    component: BoardWriteView,
  },
  {
    path: '/email/verify',
    name: 'EmailVerify',
    component: () => import('@/components/member/EmailVerify.vue'),
  },
  {
    path: '/starred/list',
    name: 'Starred',
    component: StarredView,
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
