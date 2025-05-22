<script setup>
const emit = defineEmits('close')
const viewClose = () => {
  emit('close')
}
</script>

<template>
  <div class="modal">
    <img class="close" src="@/assets/img/closeIcon.png" @click="viewClose" />
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="main">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  width: calc(100vw - 50vh);
  height: calc(90vh - 65px);
  background-color: #111111;
  box-shadow: 0 0 1vh black;
  position: fixed;
  top: calc(5vh + 65px);
  left: 5vh;
  z-index: 100;
  border: 1px solid #c9d6df;
  padding: 5vh;
  display: flex;
  flex-direction: column;
}
body:has(.map) .modal {
  background-color: #11212bf1 !important;

  &.detail {
    left: 40vh !important;
  }
}
.modal > .close {
  width: auto !important;
  height: 2.5vh;
  position: absolute;
  top: 1vh;
  left: 1vh;
  cursor: pointer;
}
.header {
  width: 100%;
  height: 5%;
  display: flex;
  gap: 1%;
  flex-shrink: 0;
  position: relative;
}
.header > * {
  height: 70%;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}
.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>
