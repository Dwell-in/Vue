<script setup>
import { onMounted, ref, computed } from 'vue'
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
  { code: 'SW8', name: '지하철역' },
  { code: 'CS2', name: '편의점' },
  { code: 'PM9', name: '약국' },
  { code: 'CE7', name: '카페' },
  { code: 'HP8', name: '병원' },
  { code: 'SC4', name: '학교' },
  { code: 'PS3', name: '어린이집/유치원' },
]

const counts = ref({})
const details = ref({})

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
    counts.value[cat.name] = res.data.data.documents.length
    details.value[cat.name] = res.data.data.documents
  }
  console.log(details.value)
}

onMounted(async () => {
  fetchAgents()
  fetchCategories()
})

const safeMax = computed(() => {
  return Math.max(...(Array.isArray(props.data) ? props.data : [0, 5]))
})
</script>

<template>
  <div class="detail-local">
    <div class="grid-title title"><i class="fa-solid fa-location-dot"></i> 주변 시설 정보</div>

    <div class="grid-content">
      <div class="agent-list">
        <h3><i class="fa-solid fa-building-circle-check"></i> 주변 중개사무소</h3>
        <ul>
          <li v-for="agent in agents" :key="agent.id">
            <strong>{{ agent?.place_name }}</strong>
            <div>{{ agent?.road_address_name || agent.address_name }}</div>
            <div>{{ agent?.phone || '전화번호 없음' }}</div>
            <div>도보 약 {{ Math.round(agent?.distance / 67) }}분 ({{ agent?.distance }}m)</div>
          </li>
        </ul>
      </div>

      <div class="facility-lists">
        <RadarChart
          v-if="Object.keys(counts).length"
          :labels="Object.keys(counts)"
          :data="Object.values(counts)"
        />
        <div v-for="(items, name) in details" :key="name">
          <h4>📍 {{ name }}</h4>
          <ul>
            <li v-for="item in items" :key="item.id">
              <strong>{{ item.place_name }}</strong>
              <div>{{ item.road_address_name || item.address_name }}</div>
              <div v-if="item.phone">📞 {{ item.phone }}</div>
            </li>
          </ul>
        </div>
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
  gap: 2vh;
  padding: 2vh 0;
  font-size: 1rem;
  line-height: 1.6;

  .agent-list {
    flex: 1;
  }

  .facility-lists {
    flex: 1;
    overflow-y: auto;
    max-height: 100%;
  }
}

.agent-list {
  padding: 1vh;
  color: white;
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1vh;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin-bottom: 1.5vh;
    padding-bottom: 1vh;
    border-bottom: 1px solid #444;
    line-height: 1.4;
  }
}
.radar-chart {
  width: 100%;
  max-width: 350px;
  height: 250px;
  margin: 0 auto;
}
</style>
