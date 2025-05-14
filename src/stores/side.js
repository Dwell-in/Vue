import { defineStore } from 'pinia'

export const useSideStore = defineStore('side', {
  state: () => ({
    chat: false,
    detail: false,
    my: false,
  }),
  actions: {
    chatToggle(oper) {
      this.chat = oper
    },
    detailToggle(oper) {
      this.detail = oper
    },
    myToggle(oper) {
      this.my = oper
    },
  },
})
