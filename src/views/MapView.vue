<script setup>
import { onMounted } from 'vue'
import { loadScript } from '@/lib/loadScript'
import Header from '@/components/header/Header.vue'
import Footer2 from '@/components/footer/Footer2.vue'

onMounted(() => {
  loadScript('https://kit.fontawesome.com/64319e1cb9.js', true)
})
</script>

<template>
  <Header></Header>
  <main></main>
  <Footer2></Footer2>
</template>

<style scoped></style>
