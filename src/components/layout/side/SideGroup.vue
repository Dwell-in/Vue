<script setup>
import SideChat from './SideChat.vue'
import SideDetail from './SideDetail.vue'
import SideMy from './SideMy.vue'
import { storeToRefs } from 'pinia'
import { useSideStore } from '@/stores/side'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
const route = useRoute()

const sideStore = useSideStore()
const { chat, detail, my } = storeToRefs(sideStore)
watch(
  () => route.fullPath,
  () => {
    sideStore.closeAll()
  },
)
</script>

<template>
  <SideDetail v-if="detail"></SideDetail>
  <SideMy v-if="my"></SideMy>
  <SideChat v-if="chat"></SideChat>
</template>

<style scoped></style>
