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
          <div v-if="droppedApts.length" class="card-list">
            <ChatCard
              v-for="apt in droppedApts"
              :key="apt.aptSeq"
              :apt="apt"
              mode="chat"
              @remove="removeFromList"
            />
          </div>

          <div class="input-wrapper">
            <input
              v-if="!droppedApts.length"
              v-model="message"
              @keyup.enter="sendMessage"
              placeholder="입력하세요"
              class="input"
            />
            <button class="send-button" @click="sendMessage">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                <!-- 노란 원 -->
                <circle cx="18" cy="18" r="18" fill="#FEE500" />

                <!-- 검은 화살표 -->
                <path
                  d="M18 10 L18 26 M18 10 L12 16 M18 10 L24 16"
                  stroke="#000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"
                />
              </svg>
            </button>
          </div>
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

const removeFromList = (aptSeq) => {
  droppedApts.value = droppedApts.value.filter((apt) => apt.aptSeq != aptSeq)
}

const sendMessage = async () => {
  if (droppedApts.value.length > 0) {
    const aptNamesInUser = droppedApts.value.map((apt) => apt.aptNm).join(', ')
    const compareText = `${aptNamesInUser}을 비교해줘`

    chatHistory.value.push({
      type: 'text',
      from: 'user',
      text: compareText,
    })

    const requestPayload = {
      aptList: droppedApts.value.map((apt) => ({
        aptSeq: apt.aptSeq,
      })),
      promptType: 'pricePredict',
    }

    try {
      droppedApts.value = []
      const res = await api.post('/api/v1/ai/price', requestPayload)

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
.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #2f2f2f;
  border-radius: 24px;
  padding: 8px 12px;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
  height: 100;
}

.input {
  flex: 1;
  border: none;
  outline: none;
  background-color: transparent;
  color: white;
  font-size: 15px;
}

.input::placeholder {
  color: #aaa;
}

.send-button {
  background-color: #fee500;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.send-button:hover {
  background-color: #ffdf00;
}
</style>
