<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import defaultProfile from '@/assets/img/default_profile.png'

// 로그인 유저 받아오기
const loginUser = ref()
onMounted(async () => {
  try {
    const res = await api.get('/api/v1/member/user-info')
    loginUser.value = res.data.data
  } catch (error) {
    console.log('logout')
  }
})

// 로그아웃
const logout = async () => {
  await api.get('/api/v1/member/logout')
  loginUser.value = null
}
</script>

<template>
  <div class="member">
    <template v-if="loginUser">
      <a href="#" @click="logout"
        ><img class="profile" :src="loginUser.profileImg || defaultProfile"
      /></a>
    </template>
    <template v-else>
      <router-link to="/member/login">로그인</router-link>
      <router-link to="/member/signup">회원가입</router-link>
    </template>
  </div>
</template>

<style scoped>
.member {
  width: 40px;
  height: 40px;
  justify-content: end;
}
.member * {
  width: 100%;
  height: 100%;
}
.profile {
  border-radius: 50%;
  overflow: hidden;
}
</style>
