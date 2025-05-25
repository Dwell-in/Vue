<script setup>
import { onMounted, ref } from 'vue'

const view = ref()

onMounted(() => {
  setTimeout(() => {
    view.value.classList.add('open')
  }, 1)
})

const emit = defineEmits('close')
const viewClose = () => {
  view.value.classList.remove('open')
  setTimeout(() => {
    emit('close')
  }, 500)
}
</script>

<template>
  <div class="sideView" ref="view">
    <img class="close" src="@/assets/img/closeIcon.png" @click="viewClose" />
    <slot></slot>
  </div>
</template>

<style scoped>
/* body:has(.home) .sideView {
}
body:has(.map) .sideView {
  height: calc(100% - 130px);
} */
.sideView {
  height: calc(100% - 65px);
  width: 40vh;
  margin-top: 65px;
  position: fixed;
  top: 0;
  left: 105%;
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
  left: calc(100% - 39.99vh) !important;
}

.sideView > .close {
  width: auto !important;
  height: 2vh;
  position: absolute;
  top: 1vh;
  left: 1vh;
  cursor: pointer;
  z-index: 10;
}
</style>
