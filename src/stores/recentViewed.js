import { defineStore } from 'pinia'

export const useRecentViewedStore = defineStore('recentViewed', {
  state: () => ({
    reloadKey: 0,
  }),
  actions: {
    triggerReload() {
      this.reloadKey++
    },
  },
})
