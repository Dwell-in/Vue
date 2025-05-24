<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/lib/api'

const route = useRoute()
const router = useRouter()
const result = ref('이메일 인증을 확인 중입니다...')

onMounted(async () => {
  const token = route.query.token
  let msg

  if (!token) {
    msg = '잘못된 접근입니다. 인증 토큰이 없습니다.'
  }
  try {
    const res = await api.get(`/api/v1/email/verify?token=${token}`)
    if (res.data.data.success === true) {
      const verifiedEmail = res.data.data.email
      localStorage.setItem('verifiedEmail', verifiedEmail)
    }
    console.log(res.data.data)
    msg = res.data.data.msg
  } catch (e) {
    msg = '인증 요청 처리 중 오류가 발생했습니다.'
  }
  result.value = msg
  setTimeout(() => {
    window.close()
  }, 5000)
})
</script>

<template>
  <div class="verify-result">
    <h2>{{ result }}</h2>
  </div>
</template>

<style scoped>
.verify-result {
  margin-top: 100px;
  text-align: center;
  font-size: 1.2em;
}
</style>
