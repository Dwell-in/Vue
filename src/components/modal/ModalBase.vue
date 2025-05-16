<script setup>

const emit = defineEmits('close')
const viewClose = () => {
  emit('close')
}
</script>

<template>
  <div class="modal">
    <img class="close" src="@/assets/img/closeIcon.png" @click="viewClose" />
    <slot></slot>
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
}
.modal > .close {
  width: auto !important;
  height: 2.5vh;
  position: absolute;
  top: 1vh;
  left: 1vh;
  cursor: pointer;
}
</style>
