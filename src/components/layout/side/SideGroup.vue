<script setup>
import SideChat from './SideChat.vue'
import SideDetail from './SideDetail.vue'
import SideMy from './SideMy.vue'
import SideRecentSearch from './SideRecentSearch.vue'
import { storeToRefs } from 'pinia'
import { useSideStore } from '@/stores/side'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
const route = useRoute()

const sideStore = useSideStore()
const { chat, detail, my, recent } = storeToRefs(sideStore)
watch(
  () => route.fullPath,
  () => {
    sideStore.closeAll()
  },
)
</script>


<template>
  <SideDetail v-if="detail" />
  <SideMy v-if="my" />
  <SideChat v-if="chat" />
  <SideRecentSearch v-if="recent" />
</template>

<style scoped></style>
