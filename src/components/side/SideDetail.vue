<script setup>
import { computed, onMounted, ref, toRef, watch } from 'vue'
import { state } from '@/lib/kakao'
import api from '@/lib/api'
import SideDefault from '@/components/side/SideDefault.vue'
import DetailChart from '@/components/detail/DetailChart.vue'
import DetailRoadView from '@/components/detail/DetailRoadView.vue'
import DetailNews from '@/components/detail/DetailNews.vue'
import { useSideStore } from '@/stores/side'

const store = useSideStore()

// 조회수 증가 후 증가된 조회수 가져오기
const viewCount = ref(0)
const getViewCount = async () => {
  const res = await api.patch(`/api/v1/house/view/${state.info.aptSeq}`)
  viewCount.value = res.data.data.viewCount
}

const isStarred = ref(false)
// 관심지역 여부 조회
const fetchStarredStatus = async () => {
  const res = await api.get(`/api/v1/house/view/starred/${state.info.aptSeq}`)
  isStarred.value = res.data.data.isStarred
}

const toggleStarred = async () => {
  const url = `/api/v1/starred/${state.info.aptSeq}`
  try {
    if (isStarred.value) {
      const confirmed = confirm('정말 관심지역에서 삭제하시겠습니까?')
      if (!confirmed) return

      await api.delete(url)
      isStarred.value = false
    } else {
      await api.post(url)
      isStarred.value = true
    }
  } catch (e) {
    alert('처리 중 오류가 발생했습니다.')
    console.error(e)
  }
}

watch(state, async () => {
  await getViewCount()
  await fetchStarredStatus()
})

onMounted(async () => {
  await getViewCount()
  await fetchStarredStatus()
})

const clonedInfo = computed(() => {
  // info 자체가 바뀌면 레퍼런스도 바뀜 → 자식 재렌더링 유도
  return state.info ? { ...state.info } : null
})
watch(clonedInfo, (newVal) => {
  console.log('clonedInfo changed:', newVal)
})
</script>

<template>
  <SideDefault class="detailView" @close="store.detailToggle(false)">
    <!-- <div>{{ props.info }}</div> -->
    <div class="info_aptNm">
      <div>
        {{ state.info?.aptNm }}
        <svg
          class="heart-toggle"
          @click="toggleStarred"
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          :fill="isStarred ? '#ff69b4' : 'none'"
          stroke="#ff69b4"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78
        7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>
      </div>
    </div>
    <div class="info_viewCount">
      <img src="@/assets/img/viewCount.png" />
      <div class="info_viewCount_count">{{ viewCount }}</div>
    </div>
    <DetailRoadView class="info-roadview" :info="clonedInfo"></DetailRoadView>
    <div class="section-title">CHART</div>
    <DetailChart :info="clonedInfo"></DetailChart>
    <div class="section-title">BLOG</div>
    <DetailNews class="info-news" :info="clonedInfo"></DetailNews>
  </SideDefault>
</template>

<style scoped>
.detailView {
  padding: 3vh 0;
}
.detailView * {
  color: white;
}

.detailView > * {
  width: 90% !important;
}

.info_aptNm {
  display: flex;
  justify-content: center;
  align-items: center;
}

.info_aptNm > div {
  position: relative;
}

.heart-toggle {
  position: absolute;
  top: calc(50% - 13px);
  right: -40px;
}

.info-stared {
  height: 30px;
  width: auto !important;
  cursor: pointer;
}

.section-title {
  margin: -2vh 0;
  font-size: 1.2em;
}

.info_aptNm > div {
  font-size: 1.5em;
  text-align: center;
  line-height: 3em;
}

.info_viewCount {
  margin: -5vh 0 -4vh;
  height: 16px;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 5px;
}

.info_viewCount img {
  height: 80%;
}

.info_viewCount > div {
  font-size: 0.8em;
}

.info-roadview {
  height: 25vh;
  margin: 0 auto;
  flex-shrink: 0;
  border-radius: 20px;
}
.info-news {
  height: 15vh;
  display: flex;
  gap: 3vh;
  overflow-y: hidden;
  flex-shrink: 0;
  -ms-overflow-style: none;
  /* 인터넷 익스플로러 */
  scrollbar-width: none;
  /* 파이어폭스 */
}

/* ( 크롬, 사파리, 오페라, 엣지 ) 동작 */
.info-news:-webkit-scrollbar {
  display: none;
}

.info-news > :deep(a) {
  flex-shrink: 0;
  width: 15vh;
  height: 15vh;
  position: relative;
  border-radius: 2vh;
  overflow: hidden;
}

.info-news :deep(img) {
  width: 100%;
  height: 100%;
}

.info-news :deep(.title) {
  width: 100%;
  height: 40%;
  position: absolute;
  bottom: 0;
  background-color: #000000c2;
  font-size: 0.7em;
}

.info-news .title b {
  font-size: 1em;
}
</style>
