<script setup>
import Footer1 from '@/components/footer/Footer1.vue'
import Header from '@/components/header/Header.vue'
import SignUpForm from '@/components/member/SignUpForm.vue'
</script>

<template>
  <Header></Header>
  <main>
    <p class="hi">Dwell-In에 오신걸 환영합니다!!</p>
    <SignUpForm></SignUpForm>
  </main>
  <Footer1></Footer1>
</template>

<style scoped>
* {
  color: black;
}
main {
  max-width: 1920px;
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
