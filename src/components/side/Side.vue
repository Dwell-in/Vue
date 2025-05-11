<script setup>
import { ref } from 'vue'

const isOpen = ref(true)
</script>

<template>
  <div class="sideView" :class="{ open: isOpen }">
    <img class="close" src="@/assets/img/closeIcon.png" @click="isOpen = false" />
    <slot></slot>
  </div>
</template>

<style scoped>
.sideView {
  width: 45vh;
  height: 100%;
  position: absolute;
  top: 0;
  left: 100%;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5vh;
  overflow-y: scroll;
  background-color: #343434d1;
  box-shadow: -0.3vh 0.3vh 1vh black;
  -ms-overflow-style: none;
  /* 인터넷 익스플로러 */
  scrollbar-width: none;
  /* 파이어폭스 */
  transition: 0.5s;
}

/* ( 크롬, 사파리, 오페라, 엣지 ) 동작 */
.sideView:-webkit-scrollbar {
  display: none;
}

.sideView:is(.open) {
  left: calc(100% - 45vh) !important;
}

.sideView > .close {
  width: auto !important;
  height: 2vh;
  position: absolute;
  top: 1vh;
  left: 1vh;
  cursor: pointer;
}
</style>
