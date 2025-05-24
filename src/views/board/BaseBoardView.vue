<script setup>
import NavBase from '@/components/layout/nav/NavBase.vue'
import LayoutFooter1 from '@/components/layout/footer/LayoutFooter1.vue'

const titles = ['공지사항', '커뮤니티', 'FAQ', '1:1 문의']
</script>

<template>
  <NavBase :titles="titles" :name="'Board'" />
  <main>
    <slot></slot>
  </main>
  <LayoutFooter1></LayoutFooter1>
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
