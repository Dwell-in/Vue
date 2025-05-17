<!-- src/views/ErrorPage.vue -->
<template>
  <div class="error-container">
    <div class="text-center">
      <h1>에러 발생</h1>
      <h1 class="error-code">{{ code }}</h1>
      <p class="error-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const code = route.params.code || 'ERROR';

const messages = {
  403: '접근 권한이 없습니다.',
  404: '페이지를 찾을 수 없습니다.',
  405: '허용되지 않은 메서드입니다.',
  500: '서버 내부 오류가 발생했습니다.',
};

const message = messages[code] || '알 수 없는 오류가 발생했습니다.';
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
</style>
