<template>
  <div id="main">
    <div class="chatbot-drop-area" @dragover.prevent @drop="onDrop">
      <div id="chatSection">
        <div id="chatHistory">
          <div v-for="(msg, index) in chatHistory" :key="index" class="message-wrapper">
            <div v-if="msg.type === 'text'" :class="['message', msg.from]">
              {{ msg.text }}
            </div>
            <!-- <div v-else-if="msg.type === 'card'" class="message user">
              <ChatCard :apt="msg.apt" mode="chat" />
            </div> -->
          </div>
        </div>

        <div id="chatForm">
          <div
            v-if="droppedApts.length"
            class="card-input-multi"
            tabindex="0"
            @keydown.enter.prevent="sendMessage"
          >
            <div class="card-list">
              <ChatCard v-for="(apt, index) in droppedApts" :key="index" :apt="apt" mode="chat" />
            </div>
            <p class="hint">Enter 키를 눌러 AI에게 비교 요청</p>
          </div>

          <input
            v-else
            v-model="message"
            @keyup.enter="sendMessage"
            id="message"
            placeholder="카드를 드래그하거나 메시지를 입력하세요"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/lib/api'
import ChatCard from '@/components/ai/ChatCart.vue'

const message = ref('')
const chatHistory = ref([])
const droppedApts = ref([])

const sendMessage = async () => {
  if (droppedApts.value.length > 0) {
    const aptNamesInUser = droppedApts.value.map((apt) => apt.aptNm).join(', ')
    const compareText = `${aptNamesInUser}을 비교해줘`

    chatHistory.value.push({
      type: 'text',
      from: 'user',
      text: compareText,
    })

    const aptNames = droppedApts.value.map((apt) => apt.aptNm).join(', ')
    const compareMessage = `아래 아파트들을 자세하게 비교해줘: ${aptNames} 그리고 이중에 하나만 뽑아줘`

    try {
      droppedApts.value = []
      const res = await api.post('/api/v1/ai/simple', {
        message: compareMessage,
      })

      chatHistory.value.push({
        type: 'text',
        from: 'bot',
        text: res.data.data.message,
      })
    } catch (e) {
      console.error(e)
    } finally {
      droppedApts.value = []
      scrollToBottom()
    }

    return
  }

  if (message.value.trim()) {
    chatHistory.value.push({ type: 'text', from: 'user', text: message.value })
    try {
      const res = await api.post('/api/v1/ai/simple', {
        message: message.value,
      })
      chatHistory.value.push({
        type: 'text',
        from: 'bot',
        text: res.data.data.message,
      })
    } catch (e) {
      console.error(e)
    } finally {
      message.value = ''
      scrollToBottom()
    }
  }
}

const onDrop = (event) => {
  const data = event.dataTransfer.getData('application/json')
  if (!data) return

  const apt = JSON.parse(data)

  if (!droppedApts.value.some((a) => a.aptSeq === apt.aptSeq)) {
    droppedApts.value.push(apt)
  }

  scrollToBottom()
}

const scrollToBottom = () => {
  setTimeout(() => {
    const el = document.getElementById('chatHistory')
    if (el) el.scrollTop = el.scrollHeight
  }, 50)
}
</script>

<style scoped>
.chatbot-drop-area {
  background-color: #1e1e1e;
  color: white;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}
.card-list {
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  justify-content: flex-start;
}
.chat-card {
  width: 180px;
  flex-shrink: 0;
}

#chatSection {
  display: flex;
  flex-direction: column;
  flex: 1;
}

#chatHistory {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 8px;
}

.message-wrapper {
  display: flex;
}

.message {
  padding: 10px 14px;
  border-radius: 16px;
  max-width: 70%;
  white-space: pre-wrap;
  position: relative;
  word-break: break-word;
}

.message.user {
  background-color: #ffeb3b;
  color: black;
  align-self: flex-end;
  margin-left: auto;
  border-bottom-right-radius: 0;
}

.message.bot {
  background-color: #333;
  color: white;
  align-self: flex-start;
  margin-right: auto;
  border-bottom-left-radius: 0;
}

.message.user::after {
  content: '';
  position: absolute;
  right: -8px;
  bottom: 0;
  width: 0;
  height: 0;
  border-left: 8px solid #ffeb3b;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.message.bot::after {
  content: '';
  position: absolute;
  left: -8px;
  bottom: 0;
  width: 0;
  height: 0;
  border-right: 8px solid #333;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

#chatForm {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

#message {
  flex: 1;
  padding: 12px;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 14px;
  background-color: #444;
  color: white;
}
</style>
