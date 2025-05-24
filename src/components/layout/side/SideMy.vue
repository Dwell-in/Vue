<script setup>
import { ref } from 'vue'
import SideBase from './SideBase.vue'
import defaultProfile from '@/assets/img/default_profile.png'
import { useSideStore } from '@/stores/side'
import { useLoginUserStore } from '@/stores/loginUser'
import { useModalStore } from '@/stores/modal'
import auth from '@/lib/auth'
import api from '@/lib/api'

const sideStore = useSideStore()
const loginUserStore = useLoginUserStore()

const logout = async () => {
  try {
    await api.post('/api/v1/auth/logout') // Redis에서 refresh 삭제
  } catch (e) {
    console.error('서버 로그아웃 실패:', e)
  } finally {
    auth.removeToken()
    loginUserStore.logout()
    sideStore.myToggle(false)
    sideStore.detailToggle(false)
    sideStore.chatToggle(false)
  }
}

const modalStore = useModalStore()

const selected = ref()

const handelSelectMenu = (menu) => {
  selected.value = menu
  if (menu == 'Favorite') {
    modalStore.closeAll()
    modalStore.favoriteToggle(true)
  }
  if (menu == 'View') {
    modalStore.closeAll()
    modalStore.recentlyToggle(true)
  }
  if (menu == 'My') {
    modalStore.closeAll()
    modalStore.myToggle(true)
  }
}
const selectChat = (menu) => {
  handelSelectMenu(menu)
  sideStore.chatToggle(true)
  setTimeout(() => {
    sideStore.myToggle(false)
  }, 500)
}

// 유저 정보 수정
const isSetting = ref(false)
const fileInput = ref()
const imgFile = ref()
const idInput = ref(loginUserStore.name)
const setImgFile = () => {
  const file = fileInput.value.files[0]
  if (!file) {
    imgFile.value = defaultProfile
    return
  }
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = () => {
    imgFile.value = reader.result
  }
}
// 정보 수정 완료
const changeProfile = () => {
  console.log(imgFile.value)
  console.log(idInput.value)
  isSetting.value = false
}
</script>

<template>
  <SideBase class="myView" @close="sideStore.myToggle(false)">
    <i class="logout fa-solid fa-arrow-right-from-bracket" @click="logout"></i>
    <form class="my-profile" @submit.prevent="" v-if="isSetting">
      <i class="fa-solid fa-check setIcon" @click="changeProfile"></i>
      <div style="position: relative">
        <i class="fa-solid fa-gear setIcon" style="top: 0; right: 0" @click="fileInput.click"></i>
        <input
          type="file"
          accept="image/*"
          style="display: none"
          ref="fileInput"
          @change="setImgFile"
        />
        <img
          class="profileIcon"
          :src="imgFile || loginUserStore.profileImg || defaultProfile"
          alt=""
        />
      </div>
      <div>
        <input class="name" type="text" size="12" v-model="idInput" />
        <div class="email" style="padding: 10px">
          {{ loginUserStore.email }}
        </div>
      </div>
    </form>
    <div class="my-profile" v-else>
      <i class="fa-solid fa-gear setIcon" @click="isSetting = true"></i>
      <div>
        <img class="profileIcon" :src="loginUserStore.profileImg || defaultProfile" alt="" />
      </div>
      <div>
        <div class="name">
          {{ loginUserStore.name }}
        </div>
        <div class="email">
          {{ loginUserStore.email }}
        </div>
      </div>
    </div>
    <div class="my-main">
      <div class="menu" @click="selectChat('Chat')" :class="{ selected: selected == 'Chat' }">
        <!-- <svg
          xmlns="http://www.w3.org/2000/svg"
          height="40px"
          viewBox="0 -960 960 960"
          width="40px"
          fill="#a7a7a7"
        >
          <path
            d="M480-80 375-238H146.67q-27.5 0-47.09-19.58Q80-277.17 80-304.67v-508.66q0-27.5 19.58-47.09Q119.17-880 146.67-880h666.66q27.5 0 47.09 19.58Q880-840.83 880-813.33v508.66q0 27.5-19.58 47.09Q840.83-238 813.33-238H585L480-80Zm0-120 69.33-104.67h264v-508.66H146.67v508.66h264L480-200Zm0-359.33Z"
          />
        </svg> -->
        <i class="fa-solid fa-comments" style="color: #a2d4fb"></i>
        <div>Chat</div>
      </div>
      <div
        class="menu"
        @click="handelSelectMenu('Favorite')"
        :class="{ selected: selected == 'Favorite' }"
      >
        <i class="fa-solid fa-star" style="color: #ffdf6b"></i>
        <!-- <i class="fa-regular fa-star" style="color: #ffdf6b"></i> -->
        <div>Favorite</div>
      </div>
      <div class="menu" @click="handelSelectMenu('View')" :class="{ selected: selected == 'View' }">
        <i class="fa-regular fa-eye" style="color: white"></i>
        <div>Recently View</div>
      </div>
      <div class="menu" @click="handelSelectMenu('?')" :class="{ selected: selected == '?' }"></div>
      <div class="menu" @click="handelSelectMenu('?')" :class="{ selected: selected == '?' }"></div>
    </div>
    <!-- <div class="my-footer">
      <div class="settings" @click="handelSelectMenu('My')">
        <i class="fa-solid fa-gear"></i>
        <div>Settings</div>
      </div>
    </div> -->
  </SideBase>
</template>

<style lang="scss" scoped>
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
  position: relative;

  & *:not(i) {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
  & .setIcon {
    position: absolute;
    top: 1vh;
    right: 1vh;
    cursor: pointer;
  }
  & .profileIcon {
    height: 100%;
    border: 1px solid #323232;
    border-radius: 50%;
  }

  & *:has(input) {
    gap: 5px;
  }
  & input {
    background-color: #141414;
    color: #a7a7a7;
    border: none;
    padding: 10px;

    &:focus {
      outline: 1px solid #a7a7a7;
    }
  }
}

.my-main {
  height: 100%;
  margin-top: 5vh;
}
.menu {
  height: 9%;
  border-radius: 10px;
  cursor: pointer;
  padding: 1vh 2vh;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 2vh;
  font-size: 1.2em;
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
.logout {
  width: auto;
  position: absolute;
  cursor: pointer;
  top: 1.5vh;
  right: 1.5vh;
}
</style>
