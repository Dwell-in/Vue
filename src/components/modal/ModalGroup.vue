<script setup>
import ModalFavorite from '@/components/modal/ModalFavorite.vue';
import ModalRecently from './ModalRecently.vue';
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modal'
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const route = useRoute()
const modalStore = useModalStore()
const { favorite, recently } = storeToRefs(modalStore)

watch(
  () => route.fullPath,
  () => {
    modalStore.closeAll()
  },
)
</script>

<template>
  <ModalFavorite v-if="favorite"></ModalFavorite>
  <ModalRecently v-if="recently"></ModalRecently>
</template>

<style scoped>
</style>
