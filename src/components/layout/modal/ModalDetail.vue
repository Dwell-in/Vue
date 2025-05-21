<script setup>
import { onMounted, ref, watch } from 'vue'
import ModalBase from './ModalBase.vue'
import api from '@/lib/api'
import { useModalStore } from '@/stores/modal'
import { useSideStore } from '@/stores/side'
import HouseChart from '@/components/house/HouseChart.vue'
import HouseNews from '@/components/house/HouseNews.vue'
import HouseRoadView from '@/components/house/HouseRoadView.vue'
import MarkDownPasser from '@/components/dwellog/MarkDownPasser.vue'
import PricePredictAi from '@/components/ai/PricePredictAi.vue'

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

      <div class="grid-ai">
        <MarkDownPasser
          text="두 아파트의 거래 내역을 분석하여 각각의 특징과 향후 가격 추세를 예측해보겠습니다.

### 1. 가격, 거래량, 연식 비교
- **개포래미안포레스트**
  - **건축년도**: 2020년
  - **최근 거래 가격**: 2025년 2월 28일 기준, 112.73㎡가 389,000만원에 거래됨.
  - **가격 추이**: 2020년에서 2025년까지 전반적으로 상승, 특히 2023년부터 가격이 안정화되면서 조금씩 상승하는 추세.
  - **거래량**: 다양한 면적대에서 안정적으로 거래가 이루어짐.

- **개포현대200동**
  - **건축년도**: 1986년
  - **최근 거래 가격**: 2025년 2월 1일 기준, 82.2㎡가 205,000만원에 거래됨.
  - **가격 추이**: 2012년부터 꾸준한 상승세, 특히 2018년 이후 급격히 상승하는 경향.
  - **거래량**: 과거 거래 내역이 더 적고, 최근 거래는 많지 않음.

### 2. 향후 가격 추세 예측
- **개포래미안포레스트**는 신축 아파트로, 이미 높은 가격대를 형성하고 있습니다. 2023년부터 가격이 안정화되면서도 약간의 상승세를 보이고 있어, 향후에도 안정적인 상승이 예상됩니다. 최신 시설과 좋은 입지를 고려할 때, 수요가 지속될 가능성이 높습니다.
  
- **개포현대200동**은 오래된 아파트임에도 불구하고 최근 몇 년간 급격한 가격 상승을 보였습니다. 이는 재개발 혹은 리모델링에 대한 기대감 때문일 수도 있습니다. 하지만 건축 연도가 오래된 만큼, 향후 시설 유지 및 관리 비용이 증가할 가능성이 있으며, 가격의 지속적 상승을 보장하기 어려울 수 있습니다.

### 3. 추천 아파트 및 이유
**개포래미안포레스트**를 추천합니다. 이유는 다음과 같습니다:
- **신축 아파트**로서 최신 시설과 안정적인 관리가 가능하며, 향후 유지보수 비용이 상대적으로 적습니다.
- **위치와 입지**: 강남권에 위치하여 교통과 생활 편의성 측면에서 우수합니다.
- **가격 안정성**: 최근 몇 년간 거래 가격이 안정화되고 있으며, 지속적인 수요 증가가 예상됩니다.

결론적으로, 개포래미안포레스트는 안정적인 가격 상승을 기대할 수 있으며, 투자가치가 높은 아파트로 판단됩니다."
        >
        </MarkDownPasser>
      </div>
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
