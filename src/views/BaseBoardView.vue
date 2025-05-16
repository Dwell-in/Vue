<script setup>
import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer1.vue'
import NavBoard from '@/components/board/NavBoard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const selectView = (categoryId) => {
  router.push({
    name: 'Board',
    params: { id: categoryId },
  })
}
</script>

<template>
  <Header></Header>
  <NavBoard @selectView="selectView"></NavBoard>
  <slot></slot>
  <Footer></Footer>
</template>

<style scoped></style>
