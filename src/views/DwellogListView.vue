<script setup>
import BaseNav from '@/components/board/BaseNav.vue'
import Footer from '@/components/footer/Footer1.vue'
import Header from '@/components/header/Header.vue'
import DwellogLinkBox from '@/components/board/md/DwellogLinkBox.vue'

const titles = ['BackEnd', 'FrontEnd']

</script>

<template>
  <Header></Header>
  <BaseNav :titles="titles" :name="'Dwellog'"/>
  <DwellogLinkBox></DwellogLinkBox>
  <main></main>
  <Footer></Footer>
</template>

<style scoped>
main {
  min-height: calc(100vh - 65px - 210px - 150px - 447px);
}
</style>
