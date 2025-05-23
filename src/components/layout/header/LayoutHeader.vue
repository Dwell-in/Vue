<script setup>
import { ref } from 'vue'
import SearchEngineAddress from './searchEngine/SearchEngineAddress.vue'
import auth from '@/lib/auth'
import defaultProfile from '@/assets/img/default_profile.png'

// pinia
import { useSideStore } from '@/stores/side'

import { useLoginUserStore } from '@/stores/loginUser'
const props = defineProps({
  isMainHeader: Boolean,
})

const hovered = ref(false)

const selectedKey = ref('add')

const engineRef = ref(null)
const handleSubmit = () => {
  engineRef.value.handleSubmit()
}

const sideStore = useSideStore()
const loginUserStore = useLoginUserStore()
</script>

<template>
  <header
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    :class="{ mainHeader: props.isMainHeader }"
  >
    <nav>
      <div class="menu" :class="{ hovered: hovered }">
        <router-link :to="{ name: 'Home' }" class="logo">
          <img src="@/assets/img/logo.png" alt="logo" />
        </router-link>
        <router-link class="" :to="{ name: 'Dwellog', params: { categoryId: 0 } }">
          Dwellog
        </router-link>
        <router-link class="noti" :to="{ name: 'Board', params: { categoryId: 0 } }">
          게시판
        </router-link>
        <router-link class="" :to="{ name: 'PropertyRegist' }">매물 등록</router-link>
        <router-link class="" :to="{ name: 'Starred' }">수정중</router-link>
      </div>
      <div>
        <form class="search" :class="{ hovered: hovered }" @submit.prevent="handleSubmit">
          <!-- <select name="key" v-model="selectedKey">
            <option value="add">주소 검색</option>
            <option value="apt">건물명 검색</option>
            <option value="board">게시판</option>
          </select>
          <div class="border-div"></div> -->
          <SearchEngineAddress v-if="selectedKey === 'add'" ref="engineRef" />
          <button class="searchBtn" type="submit">
            <img alt="search" src="@/assets/img/search.png" />
          </button>
        </form>
        <div class="member">
          <template v-if="auth.isLoggedIn()">
            <img
              @click="sideStore.myToggle(!sideStore.my)"
              class="profile"
              :src="loginUserStore.profileImg || defaultProfile"
            />
          </template>
          <template v-else>
            <router-link :to="{ name: 'Login' }" class="link">로그인</router-link>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
header {
  width: 100vw;
  height: 65px;
  background: #111519;
  background: linear-gradient(90deg, rgba(17, 21, 25, 1) 0%, rgba(16, 62, 86, 1) 100%);
  box-shadow: 0 2px 10px #0a2d44;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.mainHeader {
  background-color: #ffffff10;
}
.mainHeader :deep(a) {
  color: white;
}
nav {
  width: 100%;
  height: 65px;
  padding: 0 40px;
  margin: 0 auto;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
nav * {
  color: white;
}
nav div {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 30px;
}
.menu {
  gap: 50px;
  justify-content: start;
}
.logo {
  height: 50px;
  margin-right: 50px;
  cursor: pointer;
}
.logo img {
  height: 100%;
}
.menu:not(.hovered) {
  gap: 30px;
  transition-delay: 0.5s;
}
.search {
  width: 350px;
  height: 40px;
  background-color: #c9d6df;
  border-radius: 20px;
  display: flex;
  align-items: center;
  position: relative;
}
.search *:focus {
  outline: none;
}
.search:not(.hovered) {
  width: 60px;
  transition-delay: 0.5s;
}
.search:not(.hovered) *:not(.searchBtn, .searchBtn *) {
  opacity: 0;
  transition-delay: 0.5s;
}
.search select {
  width: 125px;
  height: 100%;
  padding: 0 20px;
  flex-shrink: 0;
  cursor: pointer;
  border: none;
  background-color: transparent;
  text-align: center;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.search div {
  width: 100%;
  height: 100%;
  position: relative;
  align-items: center;
}
.searchBtn {
  background-color: transparent;
  border: none;
  height: 80%;
  position: absolute;
  right: 10px;
  cursor: pointer;
}
.searchBtn img {
  width: 100%;
  height: 100%;
}
.search .border-div {
  width: 1px;
  height: 25px;
  border-left: 1px solid #52616b;
}
:deep(.search-input) {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  border: none;
  background-color: transparent;
}
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
  cursor: pointer;
}
.link {
  font-size: 0.8em;
  padding: 10px 20px;
  background-color: #3c659c;
  border-radius: 10px;
  white-space: nowrap;
  color: white !important;
  display: flex;
  align-items: center;
}
</style>
