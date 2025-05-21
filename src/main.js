import './assets/css/global.css'
import './assets/fonts/pretendard.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

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
    const status = error.response?.status
    if (status === 401) {
      auth.removeToken()
      router.push({ name: 'Login' })
    } else if ([403, 404, 405, 500].includes(status)) {
      router.push({ name: 'ErrorPage', params: { code: status } })
    } else {
      // 지정된 에러를 제외하면 default로 처리
      router.push({ name: 'ErrorPage', params: { code: 'default' } })
    }
    return Promise.reject(error)
  },
)

createApp(App).use(pinia).use(router).mount('#app')
