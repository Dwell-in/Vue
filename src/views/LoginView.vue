<script setup>
import Footer2 from '@/components/footer/Footer2.vue'
import Header from '@/components/header/Header.vue'
import LoginForm from '@/components/member/LoginForm.vue'
</script>

<template>
  <Header></Header>
  <main>
    <LoginForm></LoginForm>
  </main>
  <Footer2></Footer2>
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
