<script setup>
import auth from '@/lib/auth'
import { useSideStore } from '@/stores/side'
const sideStore = useSideStore()
import { useLoginUserStore } from '@/stores/loginUser'
const loginUserStore = useLoginUserStore()

// 로그아웃
const logout = async () => {
  auth.removeToken()
  loginUserStore.logout()
  sideStore.myToggle(false)
  sideStore.detailToggle(false)
  sideStore.chatToggle(false)
}

</script>

<template>
  <div class="my-footer">
    <router-link class="settings" to="/member/my">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#A7A7A7" cursor="pointer" ><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" /></svg>
      <div>Settings</div>
    </router-link>
    <div class="logout" @click="logout">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#a7a7a7"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
      <div>Log out</div>
    </div>
  </div>
</template>

<style scoped>
.my-footer{
  height: 15%;
  border-top: 1px solid #323232;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 2vh;
}
.my-footer > *{
  color: #A7A7A7;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 1vh;
}
.my-footer svg{
  height: 100%;
}
.my-footer > *:hover,
.my-footer > *:hover svg {
  color: white;
  fill: white;
}
svg{
  width: 2.5vh;
  height: 100%;
}
</style>
