import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    favorite: false,
    recently: false,
    detail: false,
    aptSeq: null,
  }),
  getters: {
    isAnyOpen(state) {
      return state.favorite || state.recently || state.detail
    }
  },
  actions: {
    favoriteToggle(oper) {
      this.favorite = oper
    },
    recentlyToggle(oper) {
      this.recently = oper
    },
    detailToggle(oper) {
      this.detail = oper
    },
    setAptSeq(aptSeq) {
      this.aptSeq = aptSeq
      this.detail = true
    },
    closeAll() {
      this.favorite = false
      this.recently = false
      this.detail = false
    },
  },
})
