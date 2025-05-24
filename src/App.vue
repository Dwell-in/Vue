<script setup>
import { onMounted } from 'vue'
import { loadScript } from '@/lib/loadScript'
import SideGroup from '@/components/layout/side/SideGroup.vue'
import ModalGroup from '@/components/layout/modal/ModalGroup.vue'
import LayoutHeader from './components/layout/header/LayoutHeader.vue'

onMounted(() => {
  loadScript('https://kit.fontawesome.com/64319e1cb9.js', true)
})
</script>
<template>
  <LayoutHeader />
  <router-view></router-view>
  <SideGroup />
  <ModalGroup />
</template>
