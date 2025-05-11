<script setup>
import { ref, onMounted } from 'vue'
const isLogined = ref(false)
onMounted(() => {
  // 로그인 여부 확인 후 isLogined true로
})
</script>

<template>
  <div class="member">
    <template v-if="isLogined">
      <router-link to="/logout"><img class="profile" /></router-link>
    </template>
    <template v-else>
      <router-link to="/login">로그인</router-link>
      <router-link to="/signup">회원가입</router-link>
    </template>
  </div>
</template>

<style scoped>
.member {
  width: 40px;
  height: 40px;
  justify-content: end;
}
.member * {
  width: 100%;
  height: 100%;
}
.profile {
  border-radius: 50%;
  overflow: hidden;
}
</style>
