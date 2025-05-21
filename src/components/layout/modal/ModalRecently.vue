<script setup>
import { onMounted, ref } from 'vue'
import ModalBase from './ModalBase.vue'
import api from '@/lib/api'
import UseCarousel from '@/lib/useCarousel.vue'
import { useModalStore } from '@/stores/modal'
import HouseCard from '@/components/house/HouseCard.vue'
import Cookies from 'js-cookie'

const modalStore = useModalStore()

const favorites = ref()
const loadRecentViewed = async () => {
  const recentViewed = Cookies.get('recentViewed')
  if (!recentViewed) {
    return null
  }

  const aptSeqList = decodeURIComponent(recentViewed).split(',')
  try {
    const responses = await Promise.all(aptSeqList.map((seq) => api.get(`/api/v1/house/${seq}`)))
    return responses.map((res) => res.data.data)
  } catch (error) {
    console.error('최근 본 매물 정보 조회 실패:', error)
  }
}

onMounted(async () => {
  favorites.value = await loadRecentViewed()
})

const close = () => {
  modalStore.recentlyToggle(false)
}
</script>

<template>
  <ModalBase @close="close">
    <template #header>
      <i class="fa-regular fa-eye"></i>
      <div>Recently View</div>
    </template>
    <template #main>
      <template v-if="favorites">
        <UseCarousel :width="'17%'" :height="'50%'" :gap="'10vh'">
          <HouseCard v-for="apt in favorites" :key="apt.id" :apt="apt"></HouseCard>
        </UseCarousel>
      </template>
    </template>
  </ModalBase>
</template>
