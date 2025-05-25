<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { init, messages, input, sendMessage, deactivateRoom } from '@/lib/chat'
import ChatRoomBase from './ChatRoomBase.vue'
import api from '@/lib/api'

const props = defineProps({
  target: {
    type: Object,
    required: true,
  },
  loginUserId: {
    type: Number,
    required: true,
  },
})
const partnerLastReadId = ref(null)

const getPartnerRead = async () => {
  const query = new URLSearchParams({
    user1Id: props.loginUserId,
    user2Id: props.target.id,
  }).toString()
  console.log(query)

  const roomRes = await api.get(`/chat/roomId?${query}`)
  const roomId = roomRes.data?.data

  const res = await api.get('/chat/read-info', {
    params: {
      userId: props.target.id,
      roomId,
    },
  })
  partnerLastReadId.value = res.data?.data?.lastReadMessageId || null
}

watch(
  () => [props.loginUserId, props.target?.id],
  ([loginUserId, targetId]) => {
    if (loginUserId && targetId) {
      getPartnerRead()
    }
  },
  { immediate: true }
)

// 마운트 시 채팅방 연결
const childComponent = ref()
onMounted(async () => {
  await init(props.target.id)
  await nextTick()
  input.value = childComponent.value.innerDiv
})

// 마운트 해제시 연결 해제
onBeforeUnmount(() => {
  deactivateRoom
})
</script>

<template>
  <ChatRoomBase
    @sendMessage="sendMessage"
    ref="childComponent"
    :messages="messages"
    :target="props.target"
    :partnerReadId="partnerLastReadId"
  />
</template>
