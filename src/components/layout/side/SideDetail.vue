<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { state } from '@/lib/kakao'
import api from '@/lib/api'
import SideBase from './SideBase.vue'
import { useSideStore } from '@/stores/side'
import { useModalStore } from '@/stores/modal'
import HouseRoadView from '@/components/house/HouseRoadView.vue'
import HouseChart from '@/components/house/HouseChart.vue'
import HouseNews from '@/components/house/HouseNews.vue'
import StarredToggle from '@/components/starred/StarredToggle.vue'
import NearbyView from '@/views/NearbyView.vue'

const sideStore = useSideStore()

// 조회수 증가 후 증가된 조회수 가져오기
const viewCount = ref(0)
const getViewCount = async () => {
  const res = await api.patch(`/api/v1/house/view/${state.info.aptSeq}`)
  viewCount.value = res.data.data.viewCount

  window.reloadRecentViewedList?.()
}

watch(state, async () => {
  await getViewCount()
})

onMounted(async () => {
  await getViewCount()
})

const clonedInfo = computed(() => {
  // info 자체가 바뀌면 레퍼런스도 바뀜 → 자식 재렌더링 유도
  return state.info ? { ...state.info } : null
})
watch(clonedInfo, (newVal) => {
  console.log('clonedInfo changed:', newVal)
})

const modalStore = useModalStore()
const selectApt = (aptSeq) => {
  modalStore.setAptSeq(aptSeq)
  sideStore.detailToggle(false)
}
</script>

<template>
  <SideBase class="detailView" @close="sideStore.detailToggle(false)">
    <svg
      class="fullBtn"
      @click="selectApt(state.info?.aptSeq)"
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#ffffff"
    >
      <path
        d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"
      />
    </svg>
    <div class="info_aptNm">
      <div>
        {{ state.info?.aptNm }}
        <StarredToggle v-if="state.info" :apt="state.info"></StarredToggle>
      </div>
    </div>
    <div class="info_viewCount">
      <img src="@/assets/img/viewCount.png" />
      <div class="info_viewCount_count">{{ viewCount }}</div>
    </div>
    <HouseRoadView class="info-roadview" :info="clonedInfo"></HouseRoadView>
    <div class="section-nearby">NEARBY</div>
    <NearbyView class="info-nearby" :info="clonedInfo"></NearbyView>
    <div class="section-title">CHART</div>
    <HouseChart :info="clonedInfo"></HouseChart>
    <div class="section-title">BLOG</div>
    <HouseNews class="info-news" :info="clonedInfo"></HouseNews>
  </SideBase>
</template>

<style scoped>
.detailView.open {
  left: 30vh !important;
}
.detailView {
  left: -40vh !important;
  background-color: #11212bf1 !important;
  border-radius: 5px;
  padding: 3vh 2vh;
}
.detailView * {
  color: white;
}

.detailView ::v-deep(.info-nearby) {
  color: black !important;
}

.info-nearby {
  color: black;
}
.detailView > * {
  width: 100% !important;
}

.fullBtn {
  width: auto !important;
  height: 3vh;
  position: absolute;
  top: 1.5vh;
  right: 1.5vh;
  cursor: pointer;
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
