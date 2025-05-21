<template>
  <div class="price-predictor">
    <h2>AI 아파트 가격 예측</h2>

    <div class="input-section">
      <label for="aptSeq">아파트 시퀀스 번호:</label>
      <input id="aptSeq" v-model="aptSeq" placeholder="예: 123456" />
      <button @click="predictPrice">예측 분석 요청</button>
    </div>

    <div v-if="loading">예측 중입니다...</div>

    <div v-if="result" class="result-box">
      <h3>📊 예측 결과</h3>
      <pre>{{ result }}</pre>
    </div>

    <div v-if="error" class="error-box">⚠️ {{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const aptSeq = ref('')
const result = ref('')
const error = ref('')
const loading = ref(false)

async function predictPrice() {
  if (!aptSeq.value.trim()) {
    error.value = '아파트 시퀀스를 입력해주세요.'
    return
  }

  error.value = ''
  result.value = ''
  loading.value = true

  try {
    const response = await axios.post('/api/v1/predict/price', aptSeq.value, {
      headers: { 'Content-Type': 'text/plain' },
    })
    result.value = response.data.message
  } catch (err) {
    error.value = '예측 요청 중 오류가 발생했습니다.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.price-predictor {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
}
.input-section {
  margin-bottom: 1rem;
}
.result-box {
  background-color: #f9f9f9;
  border-left: 5px solid #4caf50;
  padding: 1rem;
  white-space: pre-wrap;
}
.error-box {
  color: red;
  margin-top: 1rem;
}
</style>
