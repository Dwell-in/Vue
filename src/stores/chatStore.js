import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    selectedTarget: null,
    recommendMsg: null,
  }),
  actions: {
    selectTarget(target) {
      this.selectedTarget = target
    },
    setRecommendMsg(msg) {
      this.recommendMsg = msg
    },
  },
})
