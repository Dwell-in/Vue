<script setup>
import { useModalStore } from '@/stores/modal'
import { onMounted } from 'vue'
const modalStore = useModalStore()

let zIndex;
const emit = defineEmits('close')
const viewClose = () => {
  emit('close')
}

onMounted(()=>{
  zIndex = modalStore.zIndex
})
</script>

<template>
  <div class="modal" :style="{ zIndex: zIndex }">
    <img class="close" src="@/assets/img/closeIcon.png" @click="viewClose" />
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="main">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<style scoped>
.modal{
  width: calc(100vw - 50vh);
  height: calc(90vh - 65px);
  background-color: #111111;
  box-shadow: 0 0 1vh black;
  position: fixed;
  top: calc(5vh + 65px);
  left: 5vh;
  z-index: 100;
  border: 1px solid #C9D6DF;
  padding: 5vh;
  display: flex;
  flex-direction: column;
}
.modal > .close {
  width: auto !important;
  height: 2.5vh;
  position: absolute;
  top: 1vh;
  left: 1vh;
  cursor: pointer;
}
.header{
  width: 100%;
  height: 10%;
  display: flex;
  gap: 1%;
  flex-shrink: 0;
}
.header *{
  height: 50%;
  color: white;
  fill: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}
.main{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
