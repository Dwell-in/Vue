import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    zIndex: 100,
    favorite: false,
    recently: false,
  }),
  actions: {
    favoriteToggle(oper) {
      this.favorite = oper
    },
    recentlyToggle(oper) {
      this.recently = oper
    },
    closeAll(){
      this.favorite = false;
      this.recently = false;
      this.zIndex = 0;
    }
  },
})
