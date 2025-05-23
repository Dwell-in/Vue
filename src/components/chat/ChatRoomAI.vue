<script setup>
import { ref } from 'vue'
import ChatRoomBase from './ChatRoomBase.vue'

const props = defineProps({
  target: {
    type: Object,
    required: true,
  },
})

// AI에게 메시지 전송
const sendMessage = () => {}

// 대화 내역
const messages = ref()
</script>

<template>
  <ChatRoomBase
    @sendMessage="sendMessage"
    :messages="messages"
    :target="props.target"
  ></ChatRoomBase>
</template>
