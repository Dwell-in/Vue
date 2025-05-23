import { ref } from 'vue'
import api from './api'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { useLoginUserStore } from '@/stores/loginUser'

let loginUserStore

// 채팅방 Id 찾기
const roomId = ref()
const getRoomId = async (targetId) => {
  const query = new URLSearchParams({
    user1Id: loginUserStore.id,
    user2Id: targetId,
  }).toString()
  const res = await api.get(`/chat/roomId?${query}`)
  return res.data.data
}

// 채팅 메시지 목록 가져오기
const messages = ref([])
const getMessagesHistory = async () => {
  const res = await api.get(`/chat/${roomId.value}`)
  return res.data.data
}

// 웹 소켓 연결
const stompClient = ref(null)
const connect = () => {
  const socket = new SockJS(import.meta.env.VITE_API_ROOT + 'ws') // 서버의 WebSocket endpoint
  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      // 채팅방 수신 설정
      client.subscribe(`/sub/chatroom/${roomId.value}`, (message) => {
        const msg = JSON.parse(message.body)
        messages.value.push(msg)
      })
    },
  })

  client.activate()
  stompClient.value = client
}

// 메시지 전송
const input = ref('')
const sendMessage = () => {
  if (!stompClient.value || !stompClient.value.connected) return
  if (!input.value.value.trim()) return // 공백은 무시

  const msg = {
    roomId: roomId.value,
    sender: loginUserStore.id,
    content: input.value.value,
    sentAt: new Date(),
  }

  stompClient.value.publish({
    destination: '/pub/message',
    body: JSON.stringify(msg),
  })
  input.value.value = ''
}

// 채팅방 Id찾기, 연결, 이전 목록 가져오기
const init = async (targetId) => {
  loginUserStore = useLoginUserStore()
  roomId.value = await getRoomId(targetId)
  messages.value = await getMessagesHistory()
  connect()
}

// 채팅방 연결 해제
const deactivateRoom = () => {
  if (stompClient.value) {
    stompClient.value.deactivate()
  }
}

export { init, messages, input, sendMessage, deactivateRoom }
