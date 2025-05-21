<script setup>
import { ref } from 'vue'
import SideBase from './SideBase.vue'
import defaultProfile from '@/assets/img/default_profile.png'
import { useSideStore } from '@/stores/side'
import { useLoginUserStore } from '@/stores/loginUser'
import { useModalStore } from '@/stores/modal'
import auth from '@/lib/auth'

const sideStore = useSideStore()
const loginUserStore = useLoginUserStore()

// 로그아웃
const logout = async () => {
  auth.removeToken()
  loginUserStore.logout()
  sideStore.myToggle(false)
  sideStore.detailToggle(false)
  sideStore.chatToggle(false)
}

const modalStore = useModalStore()

const selected = ref()

const handelSelectMenu = (menu) => {
  selected.value = menu
  if (menu == 'Favorite') {
    modalStore.favoriteToggle(true)
    modalStore.recentlyToggle(false)
  }
  if (menu == 'View') {
    modalStore.recentlyToggle(true)
    modalStore.favoriteToggle(false)
  }
}
const selectChat = (menu) => {
  handelSelectMenu(menu)
  sideStore.chatToggle(true)
  setTimeout(() => {
    sideStore.myToggle(false)
  }, 500)
}
</script>

<template>
  <SideBase class="myView" @close="sideStore.myToggle(false)">
    <div class="my-profile">
      <div>
        <img class="profileIcon" :src="loginUserStore.profileImg || defaultProfile" alt="" />
      </div>
      <div>
        <div class="name">{{ loginUserStore.name }}</div>
        <div class="email">{{ loginUserStore.email }}</div>
      </div>
    </div>
    <div class="my-main">
      <div class="menu" @click="selectChat('Chat')" :class="{ selected: selected == 'Chat' }">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="40px"
          viewBox="0 -960 960 960"
          width="40px"
          fill="#a7a7a7"
        >
          <path
            d="M480-80 375-238H146.67q-27.5 0-47.09-19.58Q80-277.17 80-304.67v-508.66q0-27.5 19.58-47.09Q119.17-880 146.67-880h666.66q27.5 0 47.09 19.58Q880-840.83 880-813.33v508.66q0 27.5-19.58 47.09Q840.83-238 813.33-238H585L480-80Zm0-120 69.33-104.67h264v-508.66H146.67v508.66h264L480-200Zm0-359.33Z"
          />
        </svg>
        <div>Chat</div>
      </div>
      <div
        class="menu"
        @click="handelSelectMenu('Favorite')"
        :class="{ selected: selected == 'Favorite' }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="35px"
          fill="#a7a7a7"
        >
          <path
            d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"
          />
        </svg>
        <div>Favorite</div>
      </div>
      <div class="menu" @click="handelSelectMenu('View')" :class="{ selected: selected == 'View' }">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="40px"
          viewBox="0 -960 960 960"
          width="40px"
          fill="#a7a7a7"
        >
          <path
            d="M480.08-326.67q72.25 0 122.75-50.58 50.5-50.57 50.5-122.83 0-72.25-50.58-122.75-50.57-50.5-122.83-50.5-72.25 0-122.75 50.58-50.5 50.57-50.5 122.83 0 72.25 50.58 122.75 50.57 50.5 122.83 50.5Zm-.24-62.66q-46.17 0-78.34-32.33-32.17-32.32-32.17-78.5 0-46.17 32.33-78.34 32.32-32.17 78.5-32.17 46.17 0 78.34 32.33 32.17 32.32 32.17 78.5 0 46.17-32.33 78.34-32.32 32.17-78.5 32.17ZM480-200q-146 0-264.67-82.5Q96.67-365 40-500q56.67-135 175.33-217.5Q334-800 480-800t264.67 82.5Q863.33-635 920-500q-56.67 135-175.33 217.5Q626-200 480-200Zm0-300Zm-.11 233.33q118.44 0 217.61-63.5 99.17-63.5 151.17-169.83-52-106.33-151.06-169.83-99.05-63.5-217.5-63.5-118.44 0-217.61 63.5-99.17 63.5-151.83 169.83 52.66 106.33 151.72 169.83 99.05 63.5 217.5 63.5Z"
          />
        </svg>
        <div>Recently View</div>
      </div>
      <div class="menu" @click="handelSelectMenu('?')" :class="{ selected: selected == '?' }"></div>
      <div class="menu" @click="handelSelectMenu('?')" :class="{ selected: selected == '?' }"></div>
    </div>
    <div class="my-footer">
      <router-link class="settings" to="/member/my">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#A7A7A7"
          cursor="pointer"
        >
          <path
            d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
          />
        </svg>
        <div>Settings</div>
      </router-link>
      <div class="logout" @click="logout">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#a7a7a7"
        >
          <path
            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"
          />
        </svg>
        <div>Log out</div>
      </div>
    </div>
  </SideBase>
</template>

<style scoped>
.myView {
  padding: 5vh 1vh 0;
  gap: 0;
  width: 30vh;
  background-color: #111111;
}
.myView > * {
  width: 100%;
  color: #a7a7a7;
}
.myView:is(.open) {
  left: calc(100% - 30vh) !important;
}
.my-profile {
  background-color: #1d1d1d;
  border: 1px solid #323232;
  height: 10%;
  border-radius: 10px;
  display: flex;
  align-content: center;
  padding: 1vh;
  gap: 1vh;
}
.my-profile > * {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.profileIcon {
  height: 100%;
  border: 1px solid #323232;
  border-radius: 50%;
}
.my-main {
  height: 100%;
  margin-top: 5vh;
}
.menu {
  height: 10%;
  border-radius: 10px;
  cursor: pointer;
  padding: 1vh 2vh;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 2vh;
}
.menu > * {
  display: flex;
  align-items: center;
  font-size: 1.2em;
}
svg {
  width: 3vh;
  height: 100%;
}
.menu:is(.selected) {
  background-color: #1d1d1d;
  color: white;
}
.menu:is(.selected) svg {
  fill: white;
}
.menu:hover {
  color: white;
}
.menu:hover svg {
  fill: white;
}
.my-footer {
  height: 15%;
  border-top: 1px solid #323232;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 2vh;
}
.my-footer > * {
  color: #a7a7a7;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 1vh;
}
.my-footer svg {
  height: 100%;
}
.my-footer > *:hover,
.my-footer > *:hover svg {
  color: white;
  fill: white;
}
svg {
  width: 2.5vh;
  height: 100%;
}
</style>
