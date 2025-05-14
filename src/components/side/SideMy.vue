<script setup>
import api from '@/lib/api'
import { onMounted, reactive } from 'vue'
import SideDefault from '@/components/side/SideDefault.vue'
import { useSideStore } from '@/stores/side'
import defaultProfile from '@/assets/img/default_profile.png'

const store = useSideStore()

const loginUser = reactive({
  name: '',
  profileImg: '',
})

// 로그인 유저 얻어오기
const getLoginUser = async () => {
  const res = await api.get(`/api/v1/member/user-info`)
  const resUser = res.data.data
  loginUser.name = resUser.name
  loginUser.profileImg = resUser.profileImg
}
onMounted(async () => {
  await getLoginUser()
})

// 로그아웃
const logout = async () => {
  await api.get('/api/v1/member/logout')
  loginUser.value = null
}
</script>

<template>
  <SideDefault class="myView" @close="store.myToggle(false)">
    <div class="my-header">
      <span> {{ loginUser.name }} </span
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#FFFFFF"
        cursor="pointer"
        @click="logout"
      >
        <path
          d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
        />
      </svg>
      <div class="profile">
        <img class="profileIcon" :src="loginUser.profileImg || defaultProfile" alt="" />
        <img
          class="chatIcon"
          src="@/assets/img/chatIcon.png"
          alt="chatIcon"
          @click="store.chatToggle(true)"
        />
      </div>
    </div>
    <div class="my"></div>
  </SideDefault>
</template>

<style scoped>
.myView {
  padding: 0 1vh;
  gap: 0;
  flex-direction: row;
  flex-wrap: wrap;
}
.my-header {
  width: 100%;
  height: 25%;
  color: white;
  display: flex;
  align-items: center;
  font-size: 2em;
  position: relative;
}
.my-header span {
  margin: 0 2%;
  font-size: 1em;
}
.profile {
  height: 40%;
  position: absolute;
  bottom: -15%;
  right: 10%;
}
.profile .profileIcon {
  height: 100%;
  border-radius: 50%;
  border: 3px solid #4ab5e6;
}
.profile .chatIcon {
  width: 25%;
  position: absolute;
  top: -15%;
  right: 0;
  cursor: pointer;
}
.my {
  width: 100%;
  min-height: 100%;
  background-color: white;
  border-radius: 30px;
}
</style>
