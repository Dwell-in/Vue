import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { useLoginUserStore } from '@/stores/loginUser'
import api from './api'
import { ref } from 'vue'

const unreadCount = ref({})

const getUnreadCount = async () => {
  const loginUserStore = useLoginUserStore()
  const res = await api.get(`/chat/unread-count/${loginUserStore.id}`)
  console.log(res.data?.data)
  unreadCount.value = res.data.data
}

let stompClient = null

const initGlobalSocket = () => {
  const loginUserStore = useLoginUserStore()
  const socket = new SockJS(import.meta.env.VITE_API_ROOT + 'ws')
  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe(`/sub/unread/${loginUserStore.id}`, () => {
        console.log('unread 알림 수신')
        getUnreadCount()
      })
    }
  })
  stompClient = client
  client.activate()
}

export {
  initGlobalSocket,
  getUnreadCount,
  unreadCount
}
