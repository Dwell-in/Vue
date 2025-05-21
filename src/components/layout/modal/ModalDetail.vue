<script setup>
import { onMounted, ref, watch } from 'vue'
import ModalBase from './ModalBase.vue'
import api from '@/lib/api'
import { useModalStore } from '@/stores/modal'
import { useSideStore } from '@/stores/side'
import HouseChart from '@/components/house/HouseChart.vue'
import HouseNews from '@/components/house/HouseNews.vue'
import HouseRoadView from '@/components/house/HouseRoadView.vue'

const sideStore = useSideStore()

const modalStore = useModalStore()
const close = () => {
  modalStore.detailToggle(false)
}
const fullClose = () => {
  modalStore.detailToggle(false)
  sideStore.detailToggle(true)
}

const isStarred = ref(false)
// 관심지역 여부 조회
const fetchStarredStatus = async () => {
  const res = await api.get(`/api/v1/house/view/starred/${modalStore.aptSeq}`)
  isStarred.value = res.data.data.isStarred
  console.log(isStarred.value)
}

const toggleStarred = async () => {
  const url = `/api/v1/starred/${modalStore.aptSeq}`
  console.log(isStarred.value)
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

// TODO getInfo() 선택한 아파트로 변경하기
const info = ref(null)
const getInfo = async () => {
  if (modalStore.aptSeq == null) return
  const res = await api.get(`/api/v1/house/${modalStore.aptSeq}`)
  await fetchStarredStatus()
  console.log(res.data.data)
  return res.data.data
}
const setInfo = async () => {
  info.value = await getInfo()
}
onMounted(async () => {
  await setInfo()
})
watch(
  () => modalStore.aptSeq,

  async () => await setInfo(),
)

const searchCategory = ref('blog')
const changeSearchCategory = (category) => {
  searchCategory.value = category
}
</script>

<template>
  <ModalBase @close="close">
    <template #header>
      <svg
        class="heart-toggle"
        @click="toggleStarred"
        xmlns="http://www.w3.org/2000/svg"
        :fill="isStarred ? '#ff69b4' : 'none'"
        width="26"
        height="26"
        viewBox="0 0 24 24"
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
      <div class="title">{{ info?.aptNm }}</div>
      <svg
        class="side"
        @click="fullClose"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#ffffff"
      >
        <path
          d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"
        />
      </svg>
    </template>
    <template #main>
      <div class="grid-chart-title title">CHART</div>
      <div class="grid-ai-title title">AI</div>
      <div class="grid-road-view-title title">ROAD VIEW</div>
      <div class="grid-info-title title">INFO</div>
      <div class="grid-blog-title">
        <div
          class="title"
          :class="{ active: searchCategory == 'blog' }"
          @click="changeSearchCategory('blog')"
        >
          BLOG
        </div>
        <div
          class="title"
          :class="{ active: searchCategory == 'news' }"
          @click="changeSearchCategory('news')"
        >
          NEWS
        </div>
      </div>
      <div class="grid-info">
        <table>
          <tr>
            <td>건물명</td>
            <td>{{ info?.aptNm }}</td>
          </tr>
          <tr>
            <td>주소</td>
            <td>
              {{ info?.roadNm }}
              <template v-if="info?.roadNmBonbun !== '0'">{{ info?.roadNmBonbun }}</template>
              <template v-if="info?.roadNmBubun !== '0'">-{{ info?.roadNmBubun }}</template>
            </td>
          </tr>
          <tr>
            <td>건축년도</td>
            <td>{{ info?.buildYear }}</td>
          </tr>
        </table>
      </div>
      <div class="grid-ai"></div>
      <HouseRoadView v-if="info" :info="info" class="grid-road-view"></HouseRoadView>
      <div class="grid-chart">
        <HouseChart v-if="info" :info="info" :fontSize="15" :chartType="'line'"></HouseChart>
      </div>
      <HouseNews
        v-if="info"
        :info="info"
        class="grid-blog"
        :searchCategory="searchCategory"
      ></HouseNews>
    </template>
  </ModalBase>
</template>

<style scoped>
:deep(.main) {
  display: grid;
  grid-template-areas:
    'infoTitle chartTitle .    roadViewTitle'
    'info      chart      .    road         '
    'aiTitle   chart      .    road         '
    'ai        chart      .    road         '
    'ai        blogTitle  .    road         '
    'ai        blog       blog blog         ';
  grid-template-columns: 3.5fr 3fr 0.5fr 4fr;
  grid-template-rows: 1fr 2fr 1fr 1fr 1fr 4fr;
  color: white;
}
:deep(.main) > *:not(.grid-chart) {
  width: 100% !important;
  height: 100% !important;
  padding: 2vh 0;
}
.grid-chart-title {
  grid-area: chartTitle;
}
.grid-ai-title {
  grid-area: aiTitle;
}
.grid-road-view-title {
  grid-area: roadViewTitle;
}
.grid-info-title {
  grid-area: infoTitle;
}
.grid-blog-title {
  grid-area: blogTitle;
}

.grid-chart {
  grid-area: chart;
}
.grid-ai {
  grid-area: ai;
}
.grid-road-view {
  grid-area: road;
}
.grid-info {
  grid-area: info;
}
.grid-blog {
  grid-area: blog;
}

.title {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  font-weight: bold;
}
.title * {
  font-size: 1.5rem;
}

.grid-info {
  line-height: 1.5em;
}
.grid-info table {
  border-collapse: collapse;
  width: 80%;
}
.grid-info td {
  padding: 10px;
}

.grid-info td + td {
  border-left: 1px solid white;
  width: 75%;
}
.grid-info tr + tr {
  border-top: 1px solid white;
}
.grid-road-view {
  background: none !important;
}
.grid-road-view > * {
  position: relative !important;
  border-radius: 20px;
}

.grid-blog-title {
  display: flex;
  gap: 2vh;
}
.grid-blog-title .title {
  cursor: pointer;
}
.grid-blog-title .title.active {
  background-color: #3b3b3b;
  border-radius: 10px;
  padding: 5px 10px;
}

.grid-blog {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 3vh;
  overflow-y: hidden;
  flex-shrink: 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.grid-blog:-webkit-scrollbar {
  display: none;
}

.grid-blog > :deep(a) {
  flex-shrink: 0;
  height: 100%;
  aspect-ratio: 1;
  position: relative;
  border-radius: 2vh;
  overflow: hidden;
  color: white;
}

.grid-blog :deep(img) {
  width: 100%;
  height: 100%;
}

.grid-blog :deep(.title) {
  width: 100%;
  height: 40%;
  position: absolute;
  bottom: 0;
  background-color: #000000c2;
  font-size: 0.7em;
  padding: 10px 5px;
}

.grid-blog .title b {
  font-size: 1em;
}

body:not(:has(.map)) .side {
  display: none;
}
.side {
  position: absolute;
  right: 0;
  width: 3vh;
  cursor: pointer;
}
</style>
