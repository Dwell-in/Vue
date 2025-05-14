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

createApp(App).use(createPinia()).use(router).mount('#app')
