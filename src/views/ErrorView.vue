<!-- src/views/ErrorPage.vue -->
<template>
  <!-- <div class="error-container">
    <div class="text-center">
      <h1>에러 발생</h1>
      <h1 class="error-code">{{ code }}</h1>
      <p class="error-message">{{ message }}</p>
    </div>
  </div> -->
  <main>
    <img :src="imgs[code]" alt="" />
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router'
import img403 from '@/assets/img/error403.png'
import img404 from '@/assets/img/error404.png'
import img500 from '@/assets/img/error500.png'
import { ref } from 'vue'

const route = useRoute()

const code = ref()
// const messages = {
//   403: '접근 권한이 없습니다.',
//   404: '페이지를 찾을 수 없습니다.',
//   405: '허용되지 않은 메서드입니다.',
//   500: '서버 내부 오류가 발생했습니다.',
// }

code.value = route.params.code || 'ERROR'
const imgs = {
  403: img403,
  404: img404,
  500: img500,
}

// const message = messages[code] || '알 수 없는 오류가 발생했습니다.'
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fafafa;
}
.error-code {
  font-size: 6rem;
  font-weight: bold;
  color: #333;
}
.error-message {
  font-size: 1.5rem;
  color: #666;
  margin-top: 1rem;
  text-align: center;
}
main {
  height: 100vh;
  overflow: hidden;
}

img {
  width: 100vw;
  height: 100vh;
}
</style>
