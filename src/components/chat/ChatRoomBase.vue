<script setup>
import { useLoginUserStore } from '@/stores/loginUser'
import ChatMessage from './ChatMessage.vue'
import { nextTick, ref, watch } from 'vue'
import LoadingParts from '../parts/LoadingParts.vue'
import { loading } from '@/lib/chat'
import { onMounted } from 'vue'

const loginUserStore = useLoginUserStore()

const props = defineProps({
  messages: {
    type: Object,
    required: true,
  },
  target: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  partnerReadId: {
    type: Number,
  },
})

// 부모 컴포넌트에서 접근하게 설정
const innerDiv = ref(null)
defineExpose({
  innerDiv,
})

// Enter 키로 전송
const emit = defineEmits(['sendMessage'])
const handleKeydown = (e) => {
  // Shift+Enter는 줄바꿈 허용
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    emit('sendMessage')
  }
}

// 상대방의 첫번째 메시지는 프로필 보이게 설정
const shouldShowProfile = (message, index) => {
  const isUser = message.sender === loginUserStore.id
  if (isUser) return false

  // 첫 메시지는 무조건 보이도록
  if (index === 0) return true

  const prevMessage = props.messages[index - 1]
  return prevMessage.sender !== message.sender
}

// messages 변경 시 (init, 송·수신 시) 로직
const chatOutputRef = ref(null)
watch(
  () => props.messages,
  async () => {
    if (props.messages.length === 0) return

    // DOM 업데이트 후
    await nextTick()
    // 스크롤 아래로
    if (chatOutputRef.value) {
      chatOutputRef.value.scrollTop = chatOutputRef.value.scrollHeight
    }
  },
  { deep: true },
)

</script>

<template>
  <div class="chat-room">
    <div class="chat-output" ref="chatOutputRef">
      <LoadingParts v-if="loading && target.id!='AI'" :color="'black'" :size="'x2'"/>
      <ChatMessage
        v-for="(message, index) in props.messages"
        :key="message.messageId"
        :class="{ sender: message.sender == loginUserStore.id }"
        :message="message"
        :target="target"
        :profileOn="shouldShowProfile(message, index)"
        :partnerReadId="props.partnerReadId"
      />
    </div>
    <div class="chat-input">
      <textarea
        id="messageInput"
        placeholder="메시지를 입력해주세요."
        ref="innerDiv"
        @keydown="handleKeydown"
      ></textarea>
      <div class="chat-btns">
        <div></div>
        <div><button id="chat-sub" @click="$emit('sendMessage')">전송</button></div>
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
  overflow-y: auto;
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
