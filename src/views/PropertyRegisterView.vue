<script setup>
import LayoutFooter1 from '@/components/layout/footer/LayoutFooter1.vue'
import NavBase from '@/components/layout/nav/NavBase.vue'
import HouseRegistForm from '@/components/house/HouseRegistForm.vue'
</script>

<template>
  <NavBase :titles="['매물 등록']"></NavBase>
  <main>
    <HouseRegistForm></HouseRegistForm>
  </main>
  <LayoutFooter1></LayoutFooter1>
</template>

<style lang="scss" scoped>
main {
  max-width: 1200px;
  margin: 65px auto;
  min-height: calc(100vh - 65px - 150px - 210px - 130px);
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
