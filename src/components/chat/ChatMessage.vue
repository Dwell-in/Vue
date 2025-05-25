<script setup>
import { computed } from 'vue'
import DefaultProfile from '@/assets/img/default_profile.png'
import { formatTime } from '@/lib/timeFormmat'
import MarkDownPasser from '../dwellog/MarkDownPasser.vue'
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  target: {
    type: Object,
  },
  profileOn: {
    type: Boolean,
  },
  partnerReadId: {
    type: Number,
  },
})

// 줄바꿈 적용
const formattedContent = computed(() => props.message.content.replace(/\n/g, '<br/>'))
</script>

<template>
  <div class="chat-message" v-bind="$attrs">
    <img
      v-if="!$attrs.class.includes('sender') && profileOn && props.target.id != 'AI'"
      :src="props.target.profileImg || DefaultProfile"
      alt="profile"
    />
    <template v-if="$attrs.class.includes('sender')">
        <div class="time">{{ formatTime(props.message.sentAt) }}</div>
        <div class="msg" v-html="formattedContent"></div>
    </template>
    <template v-else>
      <MarkDownPasser v-if="props.target.id == 'AI'" class="msg" :text="props.message.content"/>
      <div v-else class="msg" v-html="formattedContent" :class="{margin: props.target.id != 'AI'}"></div>
      <div v-if="props.target.id != 'AI'" class="time">{{ formatTime(props.message.sentAt) }}</div>
              <span
            v-if="props.message.messageId === props.partnerReadId"
            class="read-label-inline"
          >읽음</span>
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

.chat-message > .msg {
  padding: 0.5vh 1vh;
  border-radius: 0.4vh;
}
.chat-message:not(.sender) > .msg {
  background-color: #f0f5f9;
}
.margin{
  margin-left: 4vh;
}

.chat-message:is(.sender) > .msg {
  background-color: #bbe9fd;
}

.chat-message .time {
  font-size: 0.6em;
}
.meta-line {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 2px 0 6px 0;
}

.read-label-inline {
  font-size: 11px;
  color: #888;
}

</style>
