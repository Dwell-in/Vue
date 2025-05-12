<script setup>
import { ref } from 'vue'
import api from '@/lib/api'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')

const router = useRouter()

const handleSubmit = async () => {
  const formData = new URLSearchParams()
  formData.append('email', email.value)
  formData.append('password', password.value)
  try {
    await api.post('/api/v1/member/login', formData)
    router.push({ name: 'Home' })
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <form class="login-area" @submit.prevent="handleSubmit">
    <img class="logo" src="@/assets/img/logo.png" alt="login" />
    <div>
      <label class="flex flex-a-c" for="">아이디</label>
      <input v-model="email" type="text" id="loginID" name="email" placeholder="ID" required />
    </div>
    <div>
      <label class="flex flex-a-c" for="">비밀번호</label>
      <input
        v-model="password"
        type="password"
        id="loginPW"
        name="password"
        placeholder="PASSWORD"
        required
      />
    </div>
    <button type="submit" id="loginBtn">로그인</button>
    <a class="pwFind" href="/member/password-find">비밀번호 찾기</a>
    <a
      href="https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}"
    >
      <img id="kakao-login" src="@/assets/img/kakao_login.png"
    /></a>
  </form>
</template>

<style scoped>
.login-area {
  position: absolute;
  left: 20%;
  padding: 3vh;
  box-shadow: 10px 10px 25px 10px rgba(0, 0, 0, 0.07);
  background: #fff;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 5%;
}
.login-area > * {
  height: 20%;
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

#loginBtn {
  width: 100%;
  height: 13%;
  background-color: #3c90e2;
  color: white;
  border: none;
  font-weight: bold;
  margin-top: 5%;
  cursor: pointer;
}

.pwFind {
  width: 100%;
  height: 10%;
  height: 13%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  text-decoration: none;
  color: gray;
}

a:has(#kakao-login) {
  background-color: #fee500;
  height: 10%;
}

#kakao-login {
  margin-left: auto;
  margin-right: auto;
  display: block;
  height: 100%;
}
</style>
