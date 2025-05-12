<script setup>
import api from '@/lib/api'
import { ref, onMounted } from 'vue'
import Side from '../Side.vue'
import ChatList from './ChatList.vue'
import ChatRoom from './ChatRoom.vue'

const loginUserId = ref()

// 로그인 유저 얻어오기
const getLoginUser = async () => {
  const res = await api.get(`/api/v1/member/user-info`)
  console.log('getLoginUser: ' + res.data)
  return res.data.data.id
}
onMounted(async () => {
  loginUserId.value = await getLoginUser()
})

// ChatList에서 'select-chat-room' 이벤트 수신
// ChatRoom에 'selectedTarget' 전달
const selectedTarget = ref()
const handleSelectChatRoom = (target) => {
  selectedTarget.value = target
}
</script>

<template>
  <Side class="chatView open">
    <div class="chat">
      <div class="chat-header">
        <img alt="logo" src="@/assets/img/logo-w.png" />
      </div>
      <div class="chat-body">
        <ChatList :loginUserId="loginUserId" @select-chat-room="handleSelectChatRoom" />
        <ChatRoom
          v-if="selectedTarget"
          :target="selectedTarget"
          :key="selectedTarget.id"
          :loginUserId="loginUserId"
        />
      </div>
    </div>
  </Side>
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
