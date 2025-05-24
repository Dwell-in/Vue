import { ref } from 'vue'
import api from './api'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { useLoginUserStore } from '@/stores/loginUser'

const loading = ref(true)
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
  return new Promise((resolve, reject) => {

    const socket = new SockJS(import.meta.env.VITE_API_ROOT + 'ws') // 서버의 WebSocket endpoint
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        loading.value = false
        // 채팅방 수신 설정
        client.subscribe(`/sub/chatroom/${roomId.value}`, (message) => {
          const msg = JSON.parse(message.body)
          messages.value.push(msg)
        })
        stompClient.value = client
        resolve();
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
        reject(new Error('STOMP error'));
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error', event);
        reject(new Error('WebSocket connection failed'));
      }
    })
    client.activate()
  })
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
  deactivateRoom() // 기존 채팅방 연결 해제
  loginUserStore = useLoginUserStore()
  roomId.value = await getRoomId(targetId)
  await connect()
  messages.value = await getMessagesHistory()
}

// 채팅방 연결 해제
const deactivateRoom = () => {
  if (stompClient.value) {
    loading.value = true
    messages.value = []
    stompClient.value.deactivate()
  }
}

export { init, loading, messages, input, sendMessage, deactivateRoom }
