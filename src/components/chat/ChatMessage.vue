<script setup>
import { computed } from 'vue'
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  profile: {
    type: String,
    default: '/src/assets/img/default_profile.png',
  },
  profileOn: {
    type: Boolean,
  },
})

// 줄바꿈 적용
const formattedContent = computed(() => props.message.content.replace(/\n/g, '<br/>'))

// 시간 형식 변환 함수
const formatTime = (time) => {
  // ISO 8601 형태인 '2025-05-11T11:51:57.242Z' 같은 시간은 Date 객체로 변환 가능
  const date = new Date(time)

  // 날짜가 제대로 변환되었는지 확인
  if (isNaN(date)) return ''

  // 12시간제 '오후 08:05:27' 형식으로 변환
  return new Intl.DateTimeFormat('ko-KR', {
    hour12: true, // 12시간제 사용
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}
</script>

<template>
  <div class="chat-message" v-bind="$attrs">
    <img v-if="!$attrs.class.includes('sender') && profileOn" :src="props.profile" alt="profile" />
    <template v-if="$attrs.class.includes('sender')">
      <div class="time">{{ formatTime(props.message.sentAt) }}</div>
      <div v-html="formattedContent"></div>
    </template>
    <template v-else>
      <div v-html="formattedContent"></div>
      <div class="time">{{ formatTime(props.message.sentAt) }}</div>
    </template>
  </div>
</template>
<style scoped>
.chat-message {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  width: fit-content;
  position: relative;
}

.chat-message img {
  position: absolute;
  top: 0;
  left: 0;
  height: 3vh;
  border-radius: 50%;
}

.chat-message:is(.sender) {
  align-self: end;
}

.chat-message > div:not(.time) {
  padding: 0.5vh 1vh;
  border-radius: 0.4vh;
}
.chat-message:not(.sender) > div:not(.time) {
  background-color: #f0f5f9;
  margin-left: 4vh;
}

.chat-message:is(.sender) > div:not(.time) {
  background-color: #bbe9fd;
}

.chat-message .time {
  font-size: 0.6em;
}
</style>
