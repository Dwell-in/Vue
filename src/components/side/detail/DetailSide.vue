<script setup>
import { onMounted, ref, watch } from 'vue'
import { state } from '@/lib/kakao'
import Side from '../Side.vue'
import api from '@/lib/api'
import DetailChart from './DetailChart.vue'
import DetailRoadView from './DetailRoadView.vue'
import DetailNews from './DetailNews.vue'

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
  <Side class="detailView open">
    <!-- <div>{{ props.info }}</div> -->
    <div class="info_aptNm">
      {{ state.info.aptNm }}
    </div>
    <div class="info_viewCount">
      <img src="@/assets/img/viewCount.png" />
      <div class="info_viewCount_count">{{ viewCount }}</div>
    </div>
    <DetailRoadView></DetailRoadView>
    <div class="section-title">CHART</div>
    <DetailChart></DetailChart>
    <div class="section-title">BLOG</div>
    <DetailNews></DetailNews>
  </Side>
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
</style>
