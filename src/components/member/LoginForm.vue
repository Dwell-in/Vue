<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import auth from '@/lib/auth'
import { useRouter, useRoute } from 'vue-router'
import { useLoginUserStore } from '@/stores/loginUser'
import { initGlobalSocket } from '@/lib/chatNotification'
const user = useLoginUserStore()

const email = ref('')
const password = ref('')

const router = useRouter()
const route = useRoute()

const handleSubmit = async () => {
  try {
    const response = await api.post('/api/v1/auth/login', {
      email: email.value,
      password: password.value,
    })
    const token = response.data.data.accessToken
    auth.setToken(token)

    const res = await api.get(`/api/v1/member/user-info`)
    user.login(res.data.data)

    initGlobalSocket() // 채팅 알림 구독

    router.push({ name: 'Home' })
  } catch (error) {
    console.log(error)
    alert('아이디와 비밀번호를 정확하게 입력하세요')
  }
}

const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
  import.meta.env.VITE_KAKAO_REST_API_KEY
}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}`

onMounted(async () => {
  const code = route.query.code
  if (code) {
    try {
      const res = await api.get('/api/v1/auth/kakao/login', {
        params: { code },
        withCredentials: true, // 필요한 경우
      })
      console.log(res.data.data.signup == false)
      if (res.data?.data?.signup == false) {
        console.log('로그인 성공')
        // 로그인 처리
        const token = res.data.data.token
        auth.setToken(token)
        initGlobalSocket() // 채팅 알림 구독
        router.push({
          name: 'Home',
        })
      } else {
        router.push({
          name: 'SignUp',
          query: {
            kakaoId: res.data.data.kakaoId,
            name: res.data.data.name,
          },
        })
      }
    } catch (error) {
      console.error('카카오 로그인 실패:', error)
    }
  }
})
</script>

<template>
  <form class="login-area" @submit.prevent="handleSubmit">
    <img class="logo" src="@/assets/img/logo.png" alt="login" />
    <div>
      <label class="flex flex-a-c" for="">E-Mail</label>
      <input v-model="email" type="text" id="loginID" name="email" placeholder="ID" required />
    </div>
    <div>
      <label class="flex flex-a-c" for="">Password</label>
      <input
        v-model="password"
        type="password"
        id="loginPW"
        name="password"
        placeholder="PASSWORD"
        required
      />
    </div>
    <div class="login-bottom">
      <a class="pwFind" href="/member/password-find">비밀번호 찾기</a>
      <router-link :to="{ name: 'SignUp' }" class="link">회원가입</router-link>
    </div>
    <button type="submit" class="loginBtn">로그인</button>
    <a class="loginBtn" :href="kakaoAuthUrl">
      <img id="kakao-login" src="@/assets/img/kakao_login.png"
    /></a>
  </form>
</template>

<style scoped>
.login-area {
  position: absolute;
  left: 20%;
  padding: 3vh;
  box-shadow: 0 0 20px 3px rgba(212, 212, 212, 0.07);
  background: #102d3ddc;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 5%;
}
.login-area > * {
  height: 15%;
  width: 100%;
}
.logo {
  width: 7vh;
  height: auto;
}
label {
  width: 100%;
  font-size: 1.2em;
  line-height: 2em;
}
.login-area input {
  height: 60%;
  width: 100%;
  padding: 0 3%;
  border: 1px solid #ddd;
}
.login-bottom {
  height: 5%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
}

.login-bottom * {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 0.8em;
  text-decoration: none;
  color: rgb(204, 202, 202);
}

.loginBtn {
  width: 100%;
  height: 10%;
  background-color: #3c659c;
  color: white;
  border: none;
  font-weight: bold;
  margin-top: 5%;
  cursor: pointer;
}

.loginBtn + .loginBtn {
  margin-top: -5%;
}

a:has(#kakao-login) {
  background-color: #fee500;
}

#kakao-login {
  margin-left: auto;
  margin-right: auto;
  display: block;
  height: 100%;
}
</style>
