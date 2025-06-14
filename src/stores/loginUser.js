import { defineStore } from 'pinia'

export const useLoginUserStore = defineStore('loginUser', {
  state: () => ({
    id: 0,
    email: '',
    name: '',
    phone: '',
    profileImg: null,
    role: null,
  }),
  actions: {
    login(user) {
      this.id = user.id
      this.email = user.email
      this.name = user.name
      this.phone = user.phone
      this.profileImg = user.profileImg
      this.role = user.role
    },
    logout() {
      this.id = 0
      this.email = ''
      this.name = ''
      this.phone = ''
      this.profileImg = null
      this.role = null
    },
  },
  persist: true,
})
