<script setup>
import { ref } from 'vue';
import { useSideStore } from '@/stores/side'
import { useModalStore } from '@/stores/modal';

const sideStore = useSideStore()
const modalStore = useModalStore()

const selected = ref()

const handelSelectMenu = (menu) => {
  selected.value = menu
  if (menu == 'Favorite'){
    modalStore.favoriteToggle(true)
    modalStore.recentlyToggle(false)
  }
  if (menu == 'View'){
    modalStore.recentlyToggle(true)
    modalStore.favoriteToggle(false)
  }
}
const selectChat = (menu) => {
  handelSelectMenu(menu)
  sideStore.chatToggle(true)
  setTimeout(() => {
    sideStore.myToggle(false)
  }, 500);
}
</script>

<template>
  <div class="my-main">
    <div class="menu" @click="selectChat('Chat')" :class="{selected: selected == 'Chat'}">
      <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#a7a7a7"><path d="M480-80 375-238H146.67q-27.5 0-47.09-19.58Q80-277.17 80-304.67v-508.66q0-27.5 19.58-47.09Q119.17-880 146.67-880h666.66q27.5 0 47.09 19.58Q880-840.83 880-813.33v508.66q0 27.5-19.58 47.09Q840.83-238 813.33-238H585L480-80Zm0-120 69.33-104.67h264v-508.66H146.67v508.66h264L480-200Zm0-359.33Z"/></svg>
      <div>Chat</div>
    </div>
    <div class="menu" @click="handelSelectMenu('Favorite')" :class="{selected: selected == 'Favorite'}">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="35px" fill="#a7a7a7"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
      <div>Favorite</div>
    </div>
    <div class="menu" @click="handelSelectMenu('View')" :class="{selected: selected == 'View'}">
      <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#a7a7a7"><path d="M480.08-326.67q72.25 0 122.75-50.58 50.5-50.57 50.5-122.83 0-72.25-50.58-122.75-50.57-50.5-122.83-50.5-72.25 0-122.75 50.58-50.5 50.57-50.5 122.83 0 72.25 50.58 122.75 50.57 50.5 122.83 50.5Zm-.24-62.66q-46.17 0-78.34-32.33-32.17-32.32-32.17-78.5 0-46.17 32.33-78.34 32.32-32.17 78.5-32.17 46.17 0 78.34 32.33 32.17 32.32 32.17 78.5 0 46.17-32.33 78.34-32.32 32.17-78.5 32.17ZM480-200q-146 0-264.67-82.5Q96.67-365 40-500q56.67-135 175.33-217.5Q334-800 480-800t264.67 82.5Q863.33-635 920-500q-56.67 135-175.33 217.5Q626-200 480-200Zm0-300Zm-.11 233.33q118.44 0 217.61-63.5 99.17-63.5 151.17-169.83-52-106.33-151.06-169.83-99.05-63.5-217.5-63.5-118.44 0-217.61 63.5-99.17 63.5-151.83 169.83 52.66 106.33 151.72 169.83 99.05 63.5 217.5 63.5Z"/></svg>
      <div>Recently View</div>
    </div>
    <div class="menu" @click="handelSelectMenu('?')" :class="{selected: selected == '?'}"></div>
    <div class="menu" @click="handelSelectMenu('?')" :class="{selected: selected == '?'}"></div>
  </div>
</template>

<style scoped>
.my-main{
  height: 100%;
  margin-top: 5vh;
}
.menu{
  height: 10%;
  border-radius: 10px;
  cursor: pointer;
  padding: 1vh 2vh;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 2vh;
}
.menu > *{
  display: flex;
  align-items: center;
  font-size: 1.2em;
}
svg{
  width: 3vh;
  height: 100%;
}
.menu:is(.selected){
  background-color: #1D1D1D;
  color: white;
}
.menu:is(.selected) svg{
  fill: white;
}
.menu:hover{
  color: white;
}
.menu:hover svg{
  fill: white;
}
</style>
