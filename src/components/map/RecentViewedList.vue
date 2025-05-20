<script setup>
import { ref, onMounted, watch } from 'vue'
import Cookies from 'js-cookie'
import api from '@/lib/api'
import { useRecentViewedStore } from '@/stores/recentViewed'

const emit = defineEmits(['select'])

const store = useRecentViewedStore()
const houses = ref([])

const loadRecentViewed = async () => {
  const recentViewed = Cookies.get('recentViewed')
  if (!recentViewed) {
    houses.value = []
    return
  }

  const aptSeqList = decodeURIComponent(recentViewed).split(',')
  try {
    const responses = await Promise.all(aptSeqList.map((seq) => api.get(`/api/v1/house/${seq}`)))
    houses.value = responses.map((res) => res.data.data)
  } catch (error) {
    console.error('최근 본 매물 정보 조회 실패:', error)
  }
}

onMounted(async () => {
  loadRecentViewed()
})

watch(() => store.reloadKey, loadRecentViewed)

const handleClick = (houseInfo) => {
  emit('select', houseInfo)
}
</script>

<template>
  <div class="recent-viewed-wrapper">
    <h2 class="title">최근 본 매물</h2>
    <div class="list-box">
      <ul>
        <li v-for="house in houses" :key="house?.aptSeq" @click="handleClick(house)">
          {{ house?.aptNm }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.recent-viewed-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 200px;
  max-height: 300px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
}

.list-box {
  max-height: 250px;
  overflow-y: auto;
}

.list-box ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.list-box li {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  cursor: pointer;
}

.list-box li:last-child {
  border-bottom: none;
}
</style>
