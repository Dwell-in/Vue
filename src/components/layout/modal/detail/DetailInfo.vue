
<script setup>
import { ref } from 'vue'
import HouseChart from '@/components/house/HouseChart.vue'
import HouseNews from '@/components/house/HouseNews.vue'
import HouseRoadView from '@/components/house/HouseRoadView.vue'
import PricePredictAi from '@/components/ai/PricePredictAi.vue'
import { useLoginUserStore } from '@/stores/loginUser'
import { useRouter } from 'vue-router'

const props = defineProps({
  info: Object
})

const router = useRouter()
const loginUserStore = useLoginUserStore()

const searchCategory = ref('blog')
const changeSearchCategory = (category) => {
  searchCategory.value = category
}

const canAI = ref(false)
const handleSearchAI = () => {
  if (loginUserStore.id) {
    canAI.value = true
  } else {
    if (confirm('로그인한 유저만 사용 가능합니다.\n로그인 페이지로 이동하시겠습니까?')) {
      router.push({ name: 'Login' })
    }
  }
}
</script>
<template>
  <div class="detail-info">
    <div class="grid-chart-title title"><i class="fa-solid fa-chart-line"></i> CHART</div>
    <div class="grid-ai-title title"><i class="fa-solid fa-robot"></i> AI</div>
    <div class="grid-road-view-title title">
      <i class="fa-solid fa-map-location-dot"></i> ROAD VIEW
    </div>
    <div class="grid-info-title title"><i class="fa-solid fa-magnifying-glass"></i> INFO</div>
    <div class="grid-blog-title title">
      <div :class="{ active: searchCategory == 'blog' }" @click="changeSearchCategory('blog')">
        BLOG
      </div>
      <div :class="{ active: searchCategory == 'news' }" @click="changeSearchCategory('news')">
        NEWS
      </div>
    </div>
    <div class="grid-info">
      <table>
        <tr>
          <td>건물명</td>
          <td>{{ props.info?.aptNm }}</td>
        </tr>
        <tr>
          <td>주소</td>
          <td>
            {{ props.info?.roadNm }}
            <template v-if="props.info?.roadNmBonbun !== '0'">{{ props.info?.roadNmBonbun }}</template>
            <template v-if="props.info?.roadNmBubun !== '0'">-{{ props.info?.roadNmBubun }}</template>
          </td>
        </tr>
        <tr>
          <td>건축년도</td>
          <td>{{ props.info?.buildYear }}</td>
        </tr>
      </table>
    </div>

    <div class="grid-ai">
      <div v-if="!canAI" class="blur">
        <button @click="handleSearchAI">AI 추천 받기</button>
      </div>
      <PricePredictAi v-else-if="props.info" :aptSeq="props.info.aptSeq"></PricePredictAi>
    </div>
    <HouseRoadView v-if="props.info" :info="props.info" class="grid-road-view"></HouseRoadView>
    <div class="grid-chart">
      <HouseChart v-if="props.info" :info="props.info" :fontSize="15" :chartType="'line'"></HouseChart>
    </div>
    <HouseNews
      v-if="props.info"
      :info="props.info"
      class="grid-blog"
      :searchCategory="searchCategory"
    ></HouseNews>
  </div>
</template>

<style lang="scss" scoped>

.detail-info {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: grid;
  grid-template-areas:
    'infoTitle chartTitle roadViewTitle'
    'info      chart      road         '
    'aiTitle   chart      road         '
    'ai        chart      road         '
    'ai        blogTitle  road         '
    'ai        blog       blog         ';
  grid-template-columns: 3.5fr 3.5fr 4fr;
  grid-template-rows: 1fr 2fr 1fr 1fr 1fr 4fr;
  color: white;
}
.detail-info > *:not(.grid-chart) {
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
  gap: 20px;
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
.grid-chart {
  padding-bottom: 2vh;
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

:deep(.grid-ai) {
  padding: 0 3vh 0 0 !important;

  & .blur {
    width: 100%;
    height: 100%;
    background: url('@/assets/img/blur.png');
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;

    & button {
      padding: 1vh 2vh;
      font-size: 0.8rem;
      background-color: #49b4e6;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  }

  & .md {
    height: 100%;
    overflow-y: scroll;
    padding-right: 2vh;
  }
  & .md {
    scrollbar-width: thin;
    scrollbar-color: #333 #555;
  }

  & .md::-webkit-scrollbar {
    width: 6px;
  }

  & .md::-webkit-scrollbar-track {
    background: #555;
  }

  & .md::-webkit-scrollbar-thumb {
    background-color: #333;
    border-radius: 3px;
  }
}

.grid-blog-title {
  display: flex;
  gap: 2vh;
}
.grid-blog-title.title {
  cursor: pointer;
}
.title .active {
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
  padding: 2.5vh 0 2vh !important;
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

</style>
