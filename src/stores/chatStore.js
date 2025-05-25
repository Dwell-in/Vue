import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    selectedTarget: null,
  }),
  actions: {
    selectTarget(target) {
      this.selectedTarget = target
    },
  },
})
