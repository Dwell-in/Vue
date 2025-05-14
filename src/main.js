import './assets/css/global.css'
import './assets/fonts/pretendard.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import auth from '@/lib/auth'
import api from '@/lib/api'

api.interceptors.request.use((config) => {
  const token = auth.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      auth.removeToken()
      router.push('/member/login')
    }
    return Promise.reject(error)
  },
)

createApp(App).use(createPinia()).use(router).mount('#app')
