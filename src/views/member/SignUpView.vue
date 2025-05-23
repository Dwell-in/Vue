<script setup>
import LayoutFooter1 from '@/components/layout/footer/LayoutFooter1.vue'
import LayoutHeader from '@/components/layout/header/LayoutHeader.vue'
import SignUpForm from '@/components/member/SignUpForm.vue'
</script>

<template>
  <LayoutHeader></LayoutHeader>
  <main>
    <p class="hi">Dwell-In에 오신걸 환영합니다!!</p>
    <SignUpForm></SignUpForm>
  </main>
  <LayoutFooter1></LayoutFooter1>
</template>

<style scoped>
* {
  color: black;
}
main {
  max-width: 1920px;
  min-height: calc(100vh - 215px);
  margin: 65px auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hi {
  text-align: center;
  font-size: 1.25em;
  font-weight: bold;
  line-height: 7em;
}
</style>
