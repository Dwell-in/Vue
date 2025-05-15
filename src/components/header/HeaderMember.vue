<script setup>
import auth from '@/lib/auth'
import defaultProfile from '@/assets/img/default_profile.png'

// pinia
import { useSideStore } from '@/stores/side'
const store = useSideStore()

import { useLoginUserStore } from '@/stores/loginUser'
const loginUser = useLoginUserStore()
</script>

<template>
  <div class="member">
    <template v-if="auth.isLoggedIn()">
      <a href="#" @click="store.myToggle(!store.my)"
        ><img class="profile" :src="loginUser.profileImg || defaultProfile"
      /></a>
    </template>
    <template v-else>
      <router-link to="/member/login" class="link">로그인</router-link>
      <router-link to="/member/signup" class="link">회원가입</router-link>
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
  background-color: #bbe9fd;
  border-radius: 10px;
  white-space: nowrap;
  color: #52616b !important;
}
.link:last-child {
  background-color: #c7ffc7;
}
</style>
