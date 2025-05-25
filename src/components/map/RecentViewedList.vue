<script setup>
import { ref, onMounted, watch } from 'vue'

import api from '@/lib/api'
import { useRecentViewedStore } from '@/stores/recentViewed.js'

import { useSideStore } from '@/stores/side'
import { useModalStore } from '@/stores/modal'

const modalStore = useModalStore()
const sideStore = useSideStore()
const emit = defineEmits(['select'])

const store = useRecentViewedStore()
const houses = ref([])
const STORAGE_KEY = 'recentView'

const loadRecentViewed = async () => {
  const data = sessionStorage.getItem(STORAGE_KEY)
  console.log(data)
  if (!data) {
    houses.value = []
    return
  }

  const parsed = JSON.parse(data) // ✅ 객체 배열로 바로 파싱
  const aptSeqList = parsed.map((item) => item.aptSeq)
  console.log(aptSeqList)
  try {
    const responses = await Promise.all(aptSeqList.map((seq) => api.get(`/api/v1/house/${seq}`)))
    houses.value = responses.map((res) => res.data.data)
  } catch (error) {
    console.error('최근 본 매물 정보 조회 실패:', error)
  }
}

onMounted(loadRecentViewed)

watch(() => store.list, loadRecentViewed, { deep: true })

const handleClick = (houseInfo) => {
  emit('select', houseInfo)
}

const isClose = ref(false)
</script>

<template>
  <div class="recent-viewed-wrapper" v-show="!sideStore.isAnyOpen && !modalStore.isAnyOpen">
    <div class="title">
      <h2>최근 본 매물</h2>
      <i
        class="fa-solid"
        :class="isClose ? 'fa-caret-down' : 'fa-caret-up'"
        @click="isClose = !isClose"
      ></i>
    </div>
    <div class="list-box" :class="{ close: isClose }">
      <ul>
        <li v-for="house in houses" :key="house?.aptSeq" @click="handleClick(house)">
          {{ house?.aptNm }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.recent-viewed-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 200px;
  border-radius: 8px;
  overflow: hidden;
  z-index: 1000;
}

.title {
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px 8px 0 0;
  background: #f9f9f9;
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;

  & i {
    cursor: pointer;
  }
}

.list-box {
  scrollbar-width: thin;
  height: 250px;
  max-height: 250px;
  overflow-y: auto;
  transition: 0.2s;
  position: relative;
  top: 0;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-top: 0;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

  & ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  & li {
    padding: 8px 12px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
    cursor: pointer;
  }

  & li:last-child {
    border-bottom: none;
  }

  &.close {
    top: -300px;
  }
}
</style>
