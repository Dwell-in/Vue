<script setup>
import { ref, watch } from 'vue'
import { deactivateRoom } from '@/lib/chat'
import api from '@/lib/api'
import defaultProfile from '@/assets/img/default_profile.png'
import arrowL from '@/assets/img/arrowL.png'
import arrowR from '@/assets/img/arrowR.png'
import { unreadCount } from '@/lib/chatNotification'
import { useChatStore } from '@/stores/chatStore'
const chatStore = useChatStore()

const props = defineProps({
  loginUserId: {
    type: Number,
    required: true,
  },
})

// 채팅 상대 얻어오기
const targets = ref([])
const getTargets = async () => {
  if (!props.loginUserId) return
  const res = await api.get(`/chat/targets/${props.loginUserId}`)
  const targetList = res.data.data

  const enrichedTargets = await Promise.all(
    targetList.map(async (target) => {
      const query = new URLSearchParams({
        user1Id: props.loginUserId,
        user2Id: target.id,
      }).toString()
      const roomRes = await api.get(`/chat/roomId?${query}`)

      target.roomId = roomRes.data.data // 조용히 추가
      return target
    }),
  )

  return enrichedTargets
}

// loginUserId가 바뀌면 실행
watch(
  () => props.loginUserId,
  async (newVal) => {
    if (newVal) {
      targets.value = await getTargets()
    }
  },
  { immediate: true }, // 처음 로딩 시에도 실행
)

// 채팅방 선택하기
const emit = defineEmits('select-chat-room')
const selectChatRoom = (target) => {
  deactivateRoom() // 기존 채팅방 연결 해제
  console.log(target)
  emit('select-chat-room', target)
}

// 채팅방 리스트 on/off
const isOpen = ref(true)
const listToggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="chat-list" :class="{ open: isOpen }">
    <img :src="isOpen ? arrowL : arrowR" class="close" @click="listToggle" />
    <img
      src="@/assets/img/AIProfile.png"
      style="background-color: #f9f9f9"
      title="AI"
      class="chat-room-icon"
      :class="{ selected: chatStore.selectedTarget?.id == 'AI' }"
      @click="selectChatRoom({ id: 'AI' })"
    />
    <div v-for="target in targets" :key="target.id" class="chat-room-wrapper">
      <img
        class="chat-room-icon"
        :class="{ selected: target.id === chatStore.selectedTarget?.id }"
        @click="selectChatRoom(target)"
        :src="target.profileImg || defaultProfile"
        alt="Profile"
        :title="target.name"
      />
      <div v-if="unreadCount[target.roomId] > 0" class="chat-room-badge">
        {{ unreadCount[target.roomId] }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-list {
  width: 0;
  flex-shrink: 0;
  background-color: #f0f5f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
  padding-top: 1vh;
  position: relative;
  z-index: 2;
}

.chat-list .close {
  position: absolute;
  top: 0;
  left: 75%;
  width: auto;
  height: 3%;
  cursor: pointer;
}
.chat-list:is(.open) {
  width: 15%;
}

.chat-room-icon {
  width: 80%;
  height: auto;
  cursor: pointer;
  border: 1px solid #e5e5e5;
  border-radius: 50%;
}

.chat-room-icon:is(.selected) {
  border-color: #bbe9fd;
  border-width: 3px;
}
.chat-room-wrapper {
  position: relative;
  display: inline-block;
  text-align: center;
}

.chat-room-badge {
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: red;
  color: white;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 10px;
  line-height: 1;
  min-width: 16px;
  text-align: center;
}
</style>
