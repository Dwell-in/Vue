import axios from 'axios'
import auth from '@/lib/auth'
import router from '../router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ROOT,
  // baseURL: 'http://localhost:8081/',
  // baseURL: '13.239.134.20:8081',
  // baseURL: 'http://dwellin.store/',
  withCredentials: true, // 쿠키 전송 등 필요한 옵션
})

let isRefreshing = false
let refreshSubscribers = []

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken))
  refreshSubscribers = []
}

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback)
}

api.interceptors.request.use((config) => {
  const token = auth.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    if (originalRequest.url.includes('/auth/refresh') || originalRequest.url.includes('/auth/login')) {
      return Promise.reject(error)
    }
    // 루프 방지를 위해 !originalRequest._retry 추가
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        try {
          const res = await api.post('/api/v1/auth/refresh')
          const newToken = res.data.accessToken
          auth.setToken(newToken)
          onRefreshed(newToken)
        } catch (refreshError) {
          const message = refreshError.response?.data?.error || '로그인이 필요한 서비스입니다.'
          alert(message) // 또는 toast(message)
          onRefreshed(null)
          auth.removeToken()
          router.replace({ name: 'Login' })
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          if (!newToken) {
            return reject(error)
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          resolve(api(originalRequest))
        })
      })
    }

    if ([403, 404, 405, 500].includes(status)) {
      router.replace({ name: 'ErrorPage', params: { code: status } })
    } else {
      router.replace({ name: 'ErrorPage', params: { code: 'default' } })
    }

    return Promise.reject(error)
  },
)
export default api
