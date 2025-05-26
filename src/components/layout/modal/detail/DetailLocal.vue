<script setup>
import { onMounted, ref} from 'vue'
import api from '@/lib/api'
import RadarChart from './LocalRadarChart.vue'

const props = defineProps({
  info: Object,
  lat: Number,
  lon: Number,
})

const agents = ref([])
const fetchAgents = async () => {
  const res = await api.get('/api/v1/kakao/local-search', {
    params: {
      x: props.lon,
      y: props.lat,
      categoryCode: 'AG2',
      radius: 1500,
    },
  })
  agents.value = res.data.data.documents.sort((a, b) => parseInt(a.distance) - parseInt(b.distance))
}

const categoryCodes = [
  { code: 'CS2', name: '편의점' },
  { code: 'PM9', name: '약국' },
  { code: 'CE7', name: '카페' },
  { code: 'HP8', name: '병원' },
  { code: 'SC4', name: '학교' },
  { code: 'PS3', name: '어린이집/유치원' },
]

const subwayCategory = { code: 'SW8', name: '지하철역' }

const counts = ref({})
const details = ref({})

const subway=ref()
const fetchCategories = async () => {
  for (const cat of categoryCodes) {
    const res = await api.get('/api/v1/kakao/local-search', {
      params: {
        x: props.lon,
        y: props.lat,
        categoryCode: cat.code,
        radius: 1500,
      },
    })
    counts.value[cat.name] = res.data.data.meta.total_count
    details.value[cat.name] = res.data.data.documents

    const subwayRes = await api.get('/api/v1/kakao/local-search', {
    params: {
      x: props.lon,
      y: props.lat,
      categoryCode: subwayCategory.code,
      radius: 1500,
    },
  })
  subway.value = subwayRes.data.data.documents
  }
  console.log(details.value)
}

onMounted(async () => {
  fetchAgents()
  fetchCategories()
})

const highlightWalkText = (text) => {
  return text.replace('도보', '<span class="walk-label">도보</span>')
}
</script>

<template>
  <div class="detail-local">
    <div class="grid-title title">
      <i class="fa-solid fa-location-dot"></i> 주변 시설 정보
    </div>

    <div class="grid-content">
      <div class="chart-area">
        <RadarChart
          :labels="Object.keys(counts)"
          :data="Object.values(counts)"
        />
        <div class="subway-list">
          <h4> {{ subwayCategory.name }}</h4>
          <ul>
            <li v-for="item in subway?.slice(0, 3)" :key="item.id">
              <strong>{{ item.place_name }}</strong>
              <div v-html="highlightWalkText(`도보 약 ${Math.round(item.distance / 67)}분`)"></div>
            </li>
          </ul>
        </div>
      </div>

      <div class="facility-area">
        <div
          v-for="(items, name) in details"
          :key="name"
          class="facility-block"
        >
          <h4>{{ name }}</h4>
          <ul>
            <li v-for="item in items?.slice(0, 3)" :key="item.id">
              <strong>{{ item.place_name }}</strong>
              <div v-html="highlightWalkText(`도보 약 ${Math.round(item.distance / 67)}분`)"></div>
            </li>
          </ul>
        </div>
      </div>

      <div class="agent-area">
        <h3><i class="fa-solid fa-building-circle-check"></i> 주변 중개사무소</h3>
        <ul>
          <li v-for="agent in agents" :key="agent.id">
            <strong>{{ agent.place_name }}</strong>
            <div>{{ agent.road_address_name || agent.address_name }}</div>
            <div>{{ agent.phone || '전화번호 없음' }}</div>
            <div v-html="highlightWalkText(`도보 약 ${Math.round(agent.distance / 67)}분 (${agent.distance}m)`)"></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-local {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-areas:
    'title'
    'content';
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  color: white;
}

.grid-title {
  grid-area: title;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2vh 0;
}

.grid-content {
  grid-area: content;
  display: flex;
  flex-direction: row;
  gap: 2vh;
  height: 100%;
  overflow: hidden;

  > div {
    overflow-y: auto;
  }

.chart-area {
  flex: 0.8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 2vh;
  overflow: hidden;
  padding-top: 3vh;
}

.radar-chart {
  width: 100%;
  max-width: 350px;
  height: 250px;
  margin: 0 auto;
  position: relative;
}

.radar-chart canvas {
  width: 100% !important;
  height: 100% !important;
}

.subway-list {
  width: 100%;
  padding: 1vh 1vh 0 1vh;
  font-size: 1rem;
  text-align: center;

  h4 {
    margin-bottom: 1vh;
    font-size: 1.1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 1.5vh;
    padding-bottom: 1vh;
    border-bottom: 1px solid #444;
    line-height: 1.4;
  }
}

  .facility-area {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 2vh 2vh;

  .facility-block {
    padding: 0 1vh;

    h4 {
      font-size: 1.1rem;
      margin-bottom: 1vh;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      margin-bottom: 1.5vh;
      padding-bottom: 1vh;
      border-bottom: 1px solid #444;
      line-height: 1.4;
    }
  }
}


  .agent-area {
    flex: 0.7;
  }
}

.agent-area, .facility-area {
  font-size: 1rem;
  line-height: 1.5;
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin-bottom: 1.5vh;
    padding-bottom: 1vh;
    border-bottom: 1px solid #444;
  }
}

:deep(.walk-label) {
  background-color: #49b4e6;
  color: white;
  padding: 2px 6px;
  border-radius: 6px;
  font-weight: bold;
}
</style>
