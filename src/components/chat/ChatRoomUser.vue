<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { init, messages, input, sendMessage, deactivateRoom } from '@/lib/chat'
import ChatRoomBase from './ChatRoomBase.vue'

const props = defineProps({
  target: {
    type: Object,
    required: true,
  },
})

// 마운트 시 채팅방 연결
const childComponent = ref()
onMounted(async () => {
  init(props.target.id)
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
  ></ChatRoomBase>
</template>
