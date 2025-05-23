<script setup>
import { ref } from 'vue'
import ChatRoomBase from './ChatRoomBase.vue'
import api from '@/lib/api'
import { useLoginUserStore } from '@/stores/loginUser'
import AIImg from '@/assets/img/default_profile.png'
import ChatCard from '@/components/ai/ChatCart.vue'

const loginUserStore = useLoginUserStore()

const target = {
  id: 'AI',
  profileImg: AIImg,
}

const childComponent = ref()
const message = ref('')
const messages = ref([])
const droppedApts = ref([])

const sendMessage = async () => {
  message.value = childComponent.value.innerDiv.value //채팅창으로부터 받은 데이터
  childComponent.value.innerDiv.value = ''
  let content = message.value.trim()
  if (!content) return

  if (droppedApts.value.length > 0) {
    const aptNamesInUser = droppedApts.value.map((apt) => apt.aptNm).join(', ')

    content = aptNamesInUser + ' ' + content

    const requestPayload = {
      aptList: droppedApts.value.map((apt) => ({
        aptSeq: apt.aptSeq,
      })),
    }

    droppedApts.value = []
    try {
      const res = await api.post('/api/v1/ai/price', requestPayload)
      const reply = res.data.data.message
      messages.value.push({ sender: 'ai', content: reply, sentAt: new Date() })
    } catch (e) {
      console.error('AI 응답 실패:', e)
      messages.value.push({ sender: 'ai', text: '죄송합니다. 응답에 실패했습니다.' })
    }
  } else {
    const msg = {
      sender: loginUserStore.id,
      content: content,
      sentAt: new Date(),
    }

    messages.value.push(msg)
    console.log(messages)
    try {
      const res = await api.post('/api/v1/ai/simple', {
        message: content,
      })

      const reply = res.data.data.message
      messages.value.push({ sender: 'ai', content: reply, sentAt: new Date() })
    } catch (e) {
      console.error('AI 응답 실패:', e)
      messages.value.push({ sender: 'ai', text: '죄송합니다. 응답에 실패했습니다.' })
    }
  }
}

//drop 한 데이터 추출
const onDrop = (event) => {
  const data = event.dataTransfer.getData('application/json')
  const dropedApt = JSON.parse(data)

  if (!droppedApts.value.some((apt) => apt.aptSeq === dropedApt.aptSeq)) {
    droppedApts.value.push(dropedApt)
  }
}

const removeFromList = (aptSeq) => {
  droppedApts.value = droppedApts.value.filter((apt) => apt.aptSeq != aptSeq)
}
</script>

<template>
  <div class="data-transfer">
    <transition name="slide-up">
      <div v-if="droppedApts.length" class="card-list-container">
        <div class="card-list">
          <ChatCard
            v-for="apt in droppedApts"
            :key="apt.aptSeq"
            :apt="apt"
            mode="chat"
            @remove="removeFromList"
          />
        </div>
      </div>
    </transition>
    <ChatRoomBase
      @dragover.prevent
      @drop="onDrop"
      @sendMessage="sendMessage"
      :messages="messages"
      ref="childComponent"
      :target="target"
    />
  </div>
</template>

<style scoped>
.card-list-container {
  width: 100%;
  background-color: #10344856; /* 어두운 하늘색 느낌 */
  padding: 12px 16px;
  position: absolute;
  bottom: 22%;
  width: 90%;
  left: 5%;
}
.data-transfer {
  display: flex;
  width: 100%;
  position: relative;
}

.card-list {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 12px;
}

.slide-up-enter-active {
  transition: all 0.4s ease;
}
.slide-up-leave-active {
  transition: all 0.3s ease;
  opacity: 0;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
