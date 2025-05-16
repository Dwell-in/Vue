<template>
  <div id="main">
    <div id="chatSection">
      <div id="chatHistory">
        <div v-for="(msg, index) in chatHistory" :key="index" :class="['message', msg.type]">
          {{ msg.type === 'user' ? '사용자: ' : '봇: ' }}{{ msg.text }}
        </div>
      </div>
      <div id="chatForm">
        <input
          v-model="message"
          @keyup.enter="sendMessage"
          id="message"
          placeholder="대화를 전송하려면 Enter"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/lib/api'
const message = ref('')
const chatHistory = ref([])

const sendMessage = async () => {
  if (!message.value.trim()) return

  chatHistory.value.push({ type: 'user', text: message.value })
  try {
    const res = await api.post(
      '/api/v1/ai/simple',
      {
        message: message.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    chatHistory.value.push({ type: 'bot', text: res.data.data.message })
  } catch (e) {
    console.log(e)
  } finally {
    message.value = ''
    setTimeout(() => {
      const el = document.getElementById('chatHistory')
      if (el) el.scrollTop = el.scrollHeight
    }, 50)
  }
}
</script>

<style scoped></style>
