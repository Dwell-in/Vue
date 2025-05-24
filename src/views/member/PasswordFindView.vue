<script setup>
import { ref, watchEffect, onBeforeUnmount } from 'vue'
import api from '@/lib/api'
import { useRouter } from 'vue-router'
import LayoutFooter1 from '@/components/layout/footer/LayoutFooter1.vue'

const email = ref('')

const router = useRouter()

const requestGetTempPassword = async () => {
  try {
    const res = await api.post('/api/v1/email/send-password?email=' + email.value)
    console.log(res.data.data)
    const msg = res.data.data
    alert(msg)
  } catch (err) {
    alert('이메일 인증 요청에 실패했습니다.')
  }
}
</script>

<template>
  <main>
    <section class="form-section">
      <label for="email">비밀번호를 찾을 이메일을 입력해주세요</label>
      <input type="email" id="email" v-model="email" placeholder="example@domain.com" required />
      <button @click="requestGetTempPassword">임시 비밀번호 발급</button>
    </section>
  </main>
  <LayoutFooter1></LayoutFooter1>
</template>

<style scoped>
main {
  max-width: 1920px;
  min-height: calc(100vh - 215px);
  margin: 65px auto 0;
  display: flex;
  align-items: center;
}

.container {
  padding: 50px 20px;
  text-align: center;
}

.form-section {
  margin: 30px auto;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 12px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  padding: 12px;
  background-color: #3c90e2;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #327bc7;
}
</style>
