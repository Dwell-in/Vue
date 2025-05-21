<script setup>
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modal'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import ModalFavorite from './ModalFavorite.vue'
import ModalRecently from './ModalRecently.vue'
import ModalDetail from './ModalDetail.vue'

const route = useRoute()
const modalStore = useModalStore()
const { favorite, recently, detail } = storeToRefs(modalStore)

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
  <ModalDetail v-if="detail"></ModalDetail>
</template>

<style scoped></style>
