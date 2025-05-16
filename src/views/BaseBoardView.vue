<script setup>
import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer1.vue'
import NavBoard from '@/components/board/NavBoard.vue'
</script>

<template>
  <Header></Header>
  <NavBoard></NavBoard>
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
