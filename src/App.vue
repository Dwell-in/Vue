<script setup>
import SideGroup from '@/components/side/SideGroup.vue'
import ModalGroup from './components/modal/ModalGroup.vue'
import { onMounted } from 'vue'
import { loadScript } from './lib/loadScript'

onMounted(() => {
  loadScript('https://kit.fontawesome.com/64319e1cb9.js', true)
})
</script>
<template>
  <router-view></router-view>
  <SideGroup />
  <ModalGroup />
</template>
