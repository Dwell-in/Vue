<script setup>
import { onMounted, ref, watch } from 'vue'
import { state } from '@/lib/kakao'
import api from '@/lib/api'
import SideDefault from '@/components/side/SideDefault.vue'
import DetailChart from '@/components/detail/DetailChart.vue'
import DetailRoadView from '@/components/detail/DetailRoadView.vue'
import DetailNews from '@/components/detail/DetailNews.vue'

// 조회수 증가 후 증가된 조회수 가져오기
const viewCount = ref(0)
const getViewCount = async () => {
  const res = await api.patch(`/api/v1/house/view/${state.info.aptSeq}`)
  viewCount.value = res.data.data.viewCount
}

watch(state, async () => await getViewCount())
onMounted(async () => await getViewCount())
</script>

<template>
  <SideDefault class="detailView open">
    <!-- <div>{{ props.info }}</div> -->
    <div class="info_aptNm">
      {{ state.info.aptNm }}
    </div>
    <div class="info_viewCount">
      <img src="@/assets/img/viewCount.png" />
      <div class="info_viewCount_count">{{ viewCount }}</div>
    </div>
    <DetailRoadView class="info-roadview"></DetailRoadView>
    <div class="section-title">CHART</div>
    <DetailChart></DetailChart>
    <div class="section-title">BLOG</div>
    <DetailNews class="info-news"></DetailNews>
  </SideDefault>
</template>

<style scoped>
.detailView {
  height: calc(100% - 130px) !important;
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
  gap: 10px;
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

.info_aptNm {
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
