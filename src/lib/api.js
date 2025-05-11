import axios from 'axios'

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_ROOT,
  baseURL: 'http://localhost:8081/',
  withCredentials: true, // 쿠키 전송 등 필요한 옵션
})

export default api
