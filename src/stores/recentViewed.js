import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecentViewedStore = defineStore('recentView', () => {
  const list = ref([])

  const fetchFromSession = () => {
    const saved = sessionStorage.getItem('recentView')
    list.value = saved ? JSON.parse(saved) : []
  }

  const saveSession = () => {
    sessionStorage.setItem('recentView', JSON.stringify(list.value))
  }

  const addRecentApt = (apt) => {
    list.value = list.value.filter((item) => item.aptSeq !== apt.aptSeq)
    list.value.unshift(apt)

    if (list.value.length > 10) {
      list.value = list.value.slice(0, 10)
    }
    saveSession()
  }

  fetchFromSession()

  return {
    list,
    addRecentApt,
  }
})
