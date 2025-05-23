<script setup>
import { ref } from 'vue'
import ChatRoomBase from './ChatRoomBase.vue'
import api from '@/lib/api'
import { useLoginUserStore } from '@/stores/loginUser'
import AIImg from '@/assets/img/default_profile.png'

const loginUserStore = useLoginUserStore()

const target = {
  id: 'AI',
  profileImg: AIImg,
}

const childComponent = ref()
const message = ref('')
const messages = ref([])

const sendMessage = async () => {
  console.log(childComponent.value.innerDiv.value)
  console.log('hi')
  message.value = childComponent.value.innerDiv.value
  childComponent.value.innerDiv.value = ''
  const content = message.value.trim()
  if (!content) return

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
</script>

<template>
  <ChatRoomBase
    @sendMessage="sendMessage"
    :messages="messages"
    ref="childComponent"
    :target="target"
  />
</template>
