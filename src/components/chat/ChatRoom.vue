<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watchEffect } from 'vue'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import ChatMessage from './ChatMessage.vue'
import api from '@/lib/api'

const props = defineProps({
  loginUserId: {
    type: Number,
    required: true,
  },
  target: {
    type: Object,
    required: true,
  },
})

// 채팅방 Id 찾기
const roomId = ref()
const getRoomId = async () => {
  const query = new URLSearchParams({
    user1Id: props.loginUserId,
    user2Id: props.target.id,
  }).toString()
  const res = await api.get(`/chat/roomId?${query}`)
  return res.data.data
}

// 채팅 메시지 목록 가져오기
const messages = ref([])
const getMessagesHistory = async () => {
  const res = await api.get(`/chat/${roomId.value}`)
  return res.data.data
}

// 웹 소켓 연결
const stompClient = ref(null)
const connect = () => {
  const socket = new SockJS('http://localhost:8081/ws') // 서버의 WebSocket endpoint
  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      // console.log('✅ STOMP Connected')

      client.subscribe(`/sub/chatroom/${roomId.value}`, (message) => {
        const msg = JSON.parse(message.body)
        messages.value.push(msg)
      })
    },
    // onStompError: (frame) => {
    //   console.error('❌ STOMP error:', frame)
    // },
  })

  client.activate()
  stompClient.value = client
} // connect()

// 메시지 전송
const input = ref('')
const sendMessage = () => {
  if (!stompClient.value || !stompClient.value.connected) return
  if (!input.value.trim()) return // 공백은 무시

  const msg = {
    roomId: roomId.value,
    sender: props.loginUserId,
    content: input.value,
    sentAt: new Date(),
  }

  stompClient.value.publish({
    destination: '/pub/message',
    body: JSON.stringify(msg),
  })
  input.value = ''
}
// Enter 키로 전송
const handleKeydown = (e) => {
  // Shift+Enter는 줄바꿈 허용
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

onMounted(async () => {
  roomId.value = await getRoomId()
  messages.value = await getMessagesHistory()
  connect()
})

// 마운트 해제시 연결 해제
onBeforeUnmount(() => {
  if (stompClient.value) {
    stompClient.value.deactivate()
  }
})

// messages 변경 시 (init, 송·수신 시) 로직
const chatOutputRef = ref(null)
watchEffect(async () => {
  if (messages.value.length === 0) return

  // DOM 업데이트 후 스크롤 아래로
  await nextTick()
  if (chatOutputRef.value) {
    chatOutputRef.value.scrollTop = chatOutputRef.value.scrollHeight
  }
})

const shouldShowProfile = (message, index) => {
  const isUser = message.sender === props.loginUserId
  if (isUser) return false

  // 첫 메시지는 무조건 보이도록
  if (index === 0) return true

  const prevMessage = messages.value[index - 1]
  return prevMessage.sender !== message.sender
}
</script>

<template>
  <div class="chat-room">
    <div class="chat-output" ref="chatOutputRef">
      <ChatMessage
        v-for="(message, index) in messages"
        :key="message.message_id"
        :class="{ sender: message.sender == props.loginUserId }"
        :message="message"
        :profileImg="props.target.profileImg"
        :profileOn="shouldShowProfile(message, index)"
      />
    </div>
    <div class="chat-input">
      <textarea
        id="messageInput"
        placeholder="메시지를 입력해주세요."
        v-model="input"
        @keydown="handleKeydown"
      ></textarea>
      <div class="chat-btns">
        <div></div>
        <div><button id="chat-sub" @click="sendMessage">전송</button></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-room {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1vh;
}
.chat-output {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  overflow-y: scroll;
  padding: 1vh;
}

.chat-input {
  width: 100%;
  height: 20%;
  flex-shrink: 0;
  border: 1px solid #a3a3a3;
  border-radius: 10px;
  overflow: hidden;
  padding: 1vh;
  display: flex;
  flex-direction: column;
}

.chat-input textarea {
  width: 100%;
  height: 100%;
  resize: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  border: none;
  outline: none;
}

.chat-btns {
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
}

#chat-sub {
  background-color: #e5e5e5;
  font-size: 0.8em;
  border: none;
  padding: 0.3vw 0.5vw;
  border-radius: 0.2vw;
  color: #313131;
  cursor: pointer;
}
</style>
