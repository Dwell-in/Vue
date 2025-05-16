<script setup>
defineProps(['hovered'])
</script>

<template>
  <div class="menu" :class="{ hovered: hovered }">
    <router-link to="/" class="logo">
      <img src="@/assets/img/logo.png" alt="logo" />
    </router-link>
    <router-link class="noti" to="/board/1">게시판</router-link>
    <router-link class="" to="/">메뉴</router-link>
    <router-link class="" to="/">메뉴</router-link>
    <router-link class="" to="/">메뉴</router-link>
    <router-link class="" to="/starred/list">수정중</router-link>
  </div>
</template>

<style scoped>
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
</style>
