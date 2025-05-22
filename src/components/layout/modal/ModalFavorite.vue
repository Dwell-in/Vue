<script setup>
import { computed, onMounted } from 'vue'
import ModalBase from './ModalBase.vue'
import UseCarousel from '@/lib/useCarousel.vue'
import { useModalStore } from '@/stores/modal'
import HouseCard from '@/components/house/HouseCard.vue'
import { useStarredStore } from '@/components/stores/starred'

const modalStore = useModalStore()
const starredStore = useStarredStore()

const favorites = computed(() => starredStore.starredes)

const removeFavorite = async (aptSeq) => {
  await starredStore.removeStarred(aptSeq)
}

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="35px"
        fill="#a7a7a7"
      >
        <path
          d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"
        />
      </svg>
      <div>Favorite</div>
    </template>
    <template #main>
      <template v-if="favorites">
        <UseCarousel :width="'17%'" :height="'50%'" :gap="'10vh'">
          <HouseCard
            v-for="apt in favorites"
            :key="apt.id"
            :apt="apt"
            @remove="removeFavorite"
          ></HouseCard>
        </UseCarousel>
      </template>
    </template>
  </ModalBase>
</template>
