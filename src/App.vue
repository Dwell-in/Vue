<script setup>
import SideGroup from '@/components/side/SideGroup.vue'
import ModalGroup from './components/modal/ModalGroup.vue';
</script>
<template>
  <router-view></router-view>
  <SideGroup />
  <ModalGroup />
</template>
