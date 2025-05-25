<template>
  <SideBase class="recentView" @close="onClose">
    <aside class="p-4 w-full text-white">
      <h2 class="text-lg font-semibold mb-2">최근 검색</h2>
      <ul v-if="recentList.length">
        <li v-for="(item, idx) in recentList" :key="idx" class="mb-2">
          <button @click="search(item)" class="underline text-blue-300">
            {{ item.sido }} {{ item.gugun }} {{ item.dong }}
          </button>
        </li>
      </ul>
      <p v-else class="text-sm text-gray-300">최근 검색 기록이 없습니다.</p>
    </aside>
  </SideBase>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SideBase from './SideBase.vue'
import api from '@/lib/api'
import { useSideStore } from '@/stores/side'

const store = useSideStore()

const recentList = ref([])

const loadRecent = () => {
  recentList.value = JSON.parse(sessionStorage.getItem('searchHistory') || '[]')
}

const search = async (queryObj) => {
  const query = new URLSearchParams(queryObj).toString()
  const res = await api.get(`/api/v1/house?${query}`)
  console.log('검색 결과:', res.data)
}

const onClose = () => {
  store.recentToggle(false)
}

onMounted(loadRecent)
</script>

<style scoped>
.recentView.sideView {
  background-color: rgba(20, 20, 20, 0.95); /* 더 어둡고 불투명하게 */
}
</style>
