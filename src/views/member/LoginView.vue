<script setup>
import LayoutFooter2 from '@/components/layout/footer/LayoutFooter2.vue'
import LayoutHeader from '@/components/layout/header/LayoutHeader.vue'
import LoginForm from '@/components/member/LoginForm.vue'
</script>

<template>
  <LayoutHeader></LayoutHeader>
  <main>
    <LoginForm></LoginForm>
  </main>
  <LayoutFooter2></LayoutFooter2>
</template>

<style scoped>
main {
  margin-top: 65px;
  min-width: 1920px;
  height: calc(100vh - 130px);
  gap: 15vh;
  background: url(@/assets/img/loginbg.png) right / 60% 100% no-repeat;
  position: relative;
  display: flex;
  align-items: center;
}
main > * {
  height: 60vh;
  width: 48vh;
}
</style>
