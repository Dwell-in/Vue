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
      if (document.querySelector('.sideView')) {
        document.querySelector('.sideView').scrollTop = 0
      }
    },
    detailToggle(oper) {
      this.detail = oper
      if (document.querySelector('.sideView')) {
        document.querySelector('.sideView').scrollTop = 0
      }
    },
    myToggle(oper) {
      this.my = oper
      if (document.querySelector('.sideView')) {
        document.querySelector('.sideView').scrollTop = 0
      }
    },
  },
})
