import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    zIndex: 100,
    favorite: false,
    recently: false,
    detail: true,
  }),
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
    closeAll(){
      this.favorite = false;
      this.recently = false;
      this.detail = false;
      this.zIndex = 0;
    }
  },
})
