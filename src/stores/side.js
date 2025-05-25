import { defineStore } from 'pinia'

export const useSideStore = defineStore('side', {
  state: () => ({
    chat: false,
    detail: false,
    my: false,
    recent: false,
  }),
  getters: {
    isAnyOpen(state) {
      return state.chat || state.detail || state.my || state.recent
    }
  },
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
    recentToggle(oper) {
      this.recent = oper
      if (document.querySelector('.sideView')) {
        document.querySelector('.sideView').scrollTop = 0
      }
    },
    closeAll(){
      this.chat = false;
      this.detail = false;
      this.my = false;
      this.recent = false;
    }
  },
})
