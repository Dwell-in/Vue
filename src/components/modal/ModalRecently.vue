<script setup>
import { onMounted, ref } from 'vue';
import ModalBase from './ModalBase.vue';
import HouseCard from '../detail/HouseCard.vue';
import api from '@/lib/api';
import UseCarousel from '@/lib/useCarousel.vue';
import { useModalStore } from '@/stores/modal';

const modalStore = useModalStore()

// TODO getFavorite() 쿠키에서 최근 본 목록 가져오는걸로 변경하기
const favorites = ref()
const getFavorite = async () => {
  const res = await api.get(`/api/v1/house?sido=서울특별시&gugun=강남구&dong=개포동`)
  console.log(res.data.data)
  return res.data.data
}

onMounted(async () => {
  favorites.value = await getFavorite()
})

const close = () => {
  modalStore.recentlyToggle(false)
}

</script>

<template>
  <ModalBase @close="close">
    <template #header>
      <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#a7a7a7"><path d="M480.08-326.67q72.25 0 122.75-50.58 50.5-50.57 50.5-122.83 0-72.25-50.58-122.75-50.57-50.5-122.83-50.5-72.25 0-122.75 50.58-50.5 50.57-50.5 122.83 0 72.25 50.58 122.75 50.57 50.5 122.83 50.5Zm-.24-62.66q-46.17 0-78.34-32.33-32.17-32.32-32.17-78.5 0-46.17 32.33-78.34 32.32-32.17 78.5-32.17 46.17 0 78.34 32.33 32.17 32.32 32.17 78.5 0 46.17-32.33 78.34-32.32 32.17-78.5 32.17ZM480-200q-146 0-264.67-82.5Q96.67-365 40-500q56.67-135 175.33-217.5Q334-800 480-800t264.67 82.5Q863.33-635 920-500q-56.67 135-175.33 217.5Q626-200 480-200Zm0-300Zm-.11 233.33q118.44 0 217.61-63.5 99.17-63.5 151.17-169.83-52-106.33-151.06-169.83-99.05-63.5-217.5-63.5-118.44 0-217.61 63.5-99.17 63.5-151.83 169.83 52.66 106.33 151.72 169.83 99.05 63.5 217.5 63.5Z"/></svg>
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
