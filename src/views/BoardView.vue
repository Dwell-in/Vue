<script setup>
import Footer1 from '@/components/footer/Footer1.vue'
import Header from '@/components/header/Header.vue'
import BoardMenu from '@/components/board/BoardMenu.vue'
</script>

<template>
  <Header></Header>
  <main class="container">
    <BoardMenu></BoardMenu>
  </main>
  <Footer1></Footer1>
</template>

<style scoped>
* {
  color: black;
}

main {
  margin-top: 65px;
  min-height: calc(100vh - 215px);
}
</style>
