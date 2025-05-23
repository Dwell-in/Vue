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
  height: calc(100vh - 130px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  background-image:
    linear-gradient(
      to right,
      #11151a 0.1%,
      /* 어두운 블루그레이 */ #1c232b 1%,
      /* 점점 연해지는 블루그레이 */ rgba(28, 35, 43, 0.6) 30%,
      rgba(28, 35, 43, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    ),
    url('@/assets/img/apt.jpg');

  background-repeat: no-repeat;
  background-position: right center;
  background-size: cover;
}

main > * {
  color: rgb(231, 234, 247);
  height: 60vh;
  width: 48vh;
}
</style>
