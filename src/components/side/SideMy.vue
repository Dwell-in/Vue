<script setup>
import SideDefault from '@/components/side/SideDefault.vue'
import SideMyProfile from '../my/SideMyProfile.vue';
import SideMyMenu from '../my/SideMyMenu.vue';
import SideMyFooter from '../my/SideMyFooter.vue';
import { useSideStore } from '@/stores/side'
const sideStore = useSideStore()
</script>

<template>
  <SideDefault class="myView" @close="sideStore.myToggle(false)">
    <SideMyProfile />
    <SideMyMenu />
    <SideMyFooter />
  </SideDefault>
</template>

<style scoped>
.myView {
  padding: 5vh 1vh 0;
  gap: 0;
  width: 30vh;
  background-color: #111111;
}
.myView > *{
  width: 100%;
  color: #A7A7A7;
}
.myView:is(.open) {
  left: calc(100% - 30vh) !important;
}
</style>
