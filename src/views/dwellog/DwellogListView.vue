<script setup>
import NavBase from '@/components/layout/nav/NavBase.vue'
import DwellogLinkBox from '@/components/dwellog/DwellogLinkBox.vue'
import LayoutFooter1 from '@/components/layout/footer/LayoutFooter1.vue'

const titles = ['BackEnd', 'FrontEnd']
</script>

<template>
  <NavBase :titles="titles" :name="'Dwellog'" />
  <DwellogLinkBox></DwellogLinkBox>
  <main></main>
  <LayoutFooter1></LayoutFooter1>
</template>

<style scoped>
main {
  min-height: calc(100vh - 65px - 210px - 150px - 447px);
}
</style>
