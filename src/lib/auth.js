const TOKEN_KEY = 'token'

export default {
  // 토큰 저장
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  },

  // 토큰 가져오기
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  // 토큰 삭제
  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
  },

  // 로그인 여부
  isLoggedIn() {
    return localStorage.getItem(TOKEN_KEY) != null
  },
}
