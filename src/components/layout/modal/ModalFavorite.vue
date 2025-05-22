<script setup>
import { computed, onMounted } from 'vue'
import ModalBase from './ModalBase.vue'
import UseCarousel from '@/lib/useCarousel.vue'
import { useModalStore } from '@/stores/modal'
import HouseCard from '@/components/house/HouseCard.vue'
import { useStarredStore } from '@/stores/starred'

const modalStore = useModalStore()
const starredStore = useStarredStore()

const favorites = computed(() => starredStore.starredes)

onMounted(async () => {
  if (!starredStore.starredes.length) {
    await starredStore.fetchStarred()
  }
})

const close = () => {
  modalStore.favoriteToggle(false)
}
</script>

<template>
  <ModalBase @close="close">
    <template #header>
      <i class="fa-regular fa-star" style="color: #ffdf6b"></i>
      <div>Favorite</div>
    </template>
    <template #main>
      <template v-if="favorites?.length">
        <UseCarousel :width="'17%'" :height="'50%'" :gap="'10vh'">
          <HouseCard v-for="apt in favorites" :key="apt.id" :apt="apt"></HouseCard>
        </UseCarousel>
      </template>
    </template>
  </ModalBase>
</template>
