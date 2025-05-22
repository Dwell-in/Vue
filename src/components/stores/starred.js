import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/api'

export const useStarredStore = defineStore(
  'starred',
  () => {
    const starredes = ref()

    const fetchStarred = async () => {
      try {
        const res = await api.get('/api/v1/starred')
        starredes.value = res.data.data.data
      } catch (e) {
        console.error('관심 리스트 로딩 실패', e)
      }
    }

    const setStarred = (list) => {
      starredes.value = list
    }

    const removeStarred = async (aptSeq) => {
      try {
        await api.delete(`/api/v1/starred/${aptSeq}`)
        console.log('삭제 성공')
        starredes.value = starredes.value.filter((apt) => apt.aptSeq !== aptSeq)
      } catch (e) {
        console.error('즐겨찾기 삭제 실패', e)
      }
    }

    const addStarred = async (apt) => {
      try {
        console.log(apt)
        await api.post(`/api/v1/starred/${apt.aptSeq}`)
        if (!starredes.value.find((a) => a.aptSeq === apt.aptSeq)) {
          console.log('추가 성공')
          starredes.value.push(apt)
        }
      } catch (e) {
        console.error('즐겨찾기기 추가 실패', e)
      }
    }

    return {
      starredes,
      fetchStarred,
      setStarred,
      removeStarred,
      addStarred,
    }
  },
  {
    persist: {
      key: 'favorite-store',
      storage: localStorage,
      paths: ['favorites'],
    },
  },
)
