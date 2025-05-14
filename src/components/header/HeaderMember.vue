<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import auth from '@/lib/auth'
import defaultProfile from '@/assets/img/default_profile.png'

// finia
import { useSideStore } from '@/stores/side'
const store = useSideStore()

// 로그인 유저 받아오기
const loginUser = ref()
onMounted(async () => {
  if (auth.isLoggedIn()) {
    try {
      const res = await api.get('/api/v1/member/user-info')
      loginUser.value = res.data.data
    } catch (error) {
      // 토큰 만료 등으로 401이면 로그아웃 처리
      console.error('유저 정보 조회 실패:', error)
      loginUser.value = null
    }
  }
})
</script>

<template>
  <div class="member">
    <template v-if="auth.isLoggedIn()">
      <a href="#" @click="store.myToggle(!store.my)"
        ><img class="profile" :src="loginUser?.profileImg || defaultProfile"
      /></a>
    </template>
    <template v-else>
      <router-link to="/member/login" class="link" >로그인</router-link>
      <router-link to="/member/signup" class="link" >회원가입</router-link>
    </template>
  </div>
</template>

<style scoped>
.member {
  height: 40px;
  justify-content: end;
  gap: 10px;
}
.member:not(:has(.link)) {
  width: 40px;
}
.member * {
  width: 100%;
  height: 100%;
}
.profile {
  width: 40px;
  border-radius: 50%;
  overflow: hidden;
}
.link {
  font-size: 0.8em;
  padding: 10px 20px;
  background-color: #BBE9FD;
  border-radius: 10px;
  white-space: nowrap;
  color: #52616b !important;
}
.link:last-child{
  background-color: #c7ffc7;
}
</style>
