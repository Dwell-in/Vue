<script setup>
import { computed } from 'vue'
import DefaultProfile from '@/assets/img/default_profile.png'
import { formatTime } from '@/lib/timeFormmat'
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  profileImg: {
    type: String,
    default: DefaultProfile,
  },
  profileOn: {
    type: Boolean,
  },
})

// 줄바꿈 적용
const formattedContent = computed(() => props.message.content.replace(/\n/g, '<br/>'))
</script>

<template>
  <div class="chat-message" v-bind="$attrs">
    <img
      v-if="!$attrs.class.includes('sender') && profileOn"
      :src="props.profileImg || DefaultProfile"
      alt="profile"
    />
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
