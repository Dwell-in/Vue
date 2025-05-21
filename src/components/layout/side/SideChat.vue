<script setup>
import { ref } from 'vue'
import ChatList from '@/components/chat/ChatList.vue'
import ChatRoom from '@/components/chat/ChatRoom.vue'
import { useSideStore } from '@/stores/side'
import { useLoginUserStore } from '@/stores/loginUser'
import SideBase from './SideBase.vue'
const loginUser = useLoginUserStore()

const store = useSideStore()

// ChatList에서 'select-chat-room' 이벤트 수신
// ChatRoom에 'selectedTarget' 전달
const selectedTarget = ref()
const handleSelectChatRoom = (target) => {
  selectedTarget.value = target
}
</script>

<template>
  <SideBase class="chatView" @close="store.chatToggle(false)">
    <div class="chat">
      <div class="chat-header">
        <img alt="logo" src="@/assets/img/logo-w.png" />
      </div>
      <div class="chat-body">
        <ChatList :loginUserId="loginUser.id" @select-chat-room="handleSelectChatRoom" />
        <ChatRoom
          v-if="selectedTarget"
          :target="selectedTarget"
          :key="selectedTarget.id"
          :loginUserId="loginUser.id"
        />
      </div>
    </div>
  </SideBase>
</template>

<style scoped>
.chatView {
  padding: 4vh 0 2vh;
}

.chat {
  width: 95%;
  height: 100%;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  width: 100%;
  height: 7%;
  flex-shrink: 0;
  border-bottom: 1px solid #f0f5f9;
  display: flex;
  align-items: center;
  padding-left: 0.3vh;
}

.chat-header > img {
  height: 80%;
}

.chat-body {
  display: flex;
  height: 93%;
}
</style>
