<script setup>
import { onMounted, ref, watch } from 'vue'
import ModalBase from './ModalBase.vue'
import api from '@/lib/api'
import UseCarousel from '@/lib/useCarousel.vue'
import { useModalStore } from '@/stores/modal'
import HouseCard from '@/components/house/HouseCard.vue'
import { useRecentViewedStore } from '@/stores/recentViewed.js'

const modalStore = useModalStore()
const recentStore = useRecentViewedStore()
const recently = ref()

const loadRecentViewed = async () => {
  try {
    const aptSeqList = recentStore.list.map((item) => item.aptSeq)
    const responses = await Promise.all(aptSeqList.map((seq) => api.get(`/api/v1/house/${seq}`)))
    recently.value = responses.map((res) => res.data.data)
  } catch (error) {
    console.error('최근 본 매물 정보 조회 실패:', error)
  }
}

onMounted(async () => {
  loadRecentViewed()
})

const close = () => {
  modalStore.recentlyToggle(false)
}

watch(() => recentStore.list, loadRecentViewed, { deep: true })
</script>

<template>
  <ModalBase @close="close">
    <template #header>
      <i class="fa-regular fa-eye"></i>
      <div>Recently View</div>
    </template>
    <template #main>
      <template v-if="recently && recently.length > 0">
        <UseCarousel :width="'17%'" :height="'50%'" :gap="'10vh'">
          <HouseCard v-for="apt in recently" :key="apt.id" :apt="apt"></HouseCard>
        </UseCarousel>
      </template>
    </template>
  </ModalBase>
</template>
