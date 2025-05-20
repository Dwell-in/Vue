<script setup>
import Header from '@/components/header/Header.vue'
import BaseNav from '@/components/board/BaseNav.vue'
import Footer from '@/components/footer/Footer1.vue'

const titles = ['공지사항', '커뮤니티', 'FAQ', '1:1 문의']
</script>

<template>
  <Header></Header>
  <BaseNav :titles="titles" :name="'Board'"/>
  <main>
    <slot></slot>
  </main>
  <Footer></Footer>
</template>

<style scoped>
main {
  max-width: 1200px;
  margin: 20px auto 0;
  min-height: calc(100vh - 65px - 210px - 150px);
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
