<template>
  <div class="dashboard-container">
    <h2 class="dashboard-title">EC2 모니터링</h2>
    <nav class="range-nav">
      <button
        v-for="option in rangeOptions"
        :key="option.value"
        :class="{ active: range === option.value }"
        @click="selectRange(option.value)"
      >
        {{ option.label }}
      </button>
    </nav>

    <div class="card-container">
      <div v-for="(series, name) in data" :key="name" class="card">
        <div class="card-header">
          <h3>{{ getMetricLabel(name) + ' (' + getUnitLabel(name) + ')' }}</h3>
        </div>
        <line-chart :series="series" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/lib/api'
import LineChart from '@/components/admincomponent/LineChart.vue'

const instanceId = 'i-0a87be450c1f457fb'
const range = ref('1h')
const data = ref({})

const rangeOptions = [
  { label: '1시간', value: '1h' },
  { label: '12시간', value: '12h' },
  { label: '1일', value: '1d' },
  { label: '1주', value: '1w' },
]

const selectRange = (value) => {
  range.value = value
  loadData()
}

const loadData = async () => {
  const res = await api.get('/api/v1/cloudwatch/metrics', {
    params: { instanceId, range: range.value },
  })
  data.value = Object.fromEntries(
    Object.entries(res.data.data).map(([key, values]) => [
      key,
      values.map((v) => ({ x: v.time, y: v.value })),
    ]),
  )
}

const getMetricLabel = (key) => {
  const labels = {
    CPUUtilization: 'CPU 사용률',
    NetworkIn: '네트워크 입력',
    NetworkOut: '네트워크 출력',
    NetworkPacketsIn: '패킷 입력',
    NetworkPacketsOut: '패킷 출력',
    MetadataNoToken: '메타데이터 토큰 없음',
    CPUCreditUsage: 'CPU 크레딧 사용량',
    CPUCreditBalance: 'CPU 크레딧 잔량',
  }
  return labels[key] || key
}

const getUnitLabel = (key) => {
  const units = {
    CPUUtilization: '%',
    NetworkIn: 'Bytes',
    NetworkOut: 'Bytes',
    NetworkPacketsIn: 'Count',
    NetworkPacketsOut: 'Count',
    MetadataNoToken: 'Count',
    CPUCreditUsage: 'Count',
    CPUCreditBalance: 'Count',
  }
  return units[key] || ''
}
</script>

<style scoped>
.dashboard-container {
  margin-top: 100px;
}
.dashboard-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.range-nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.range-nav button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #eee;
  border-radius: 4px;
  cursor: pointer;
}

.range-nav button.active {
  background-color: #007bff;
  color: #fff;
}

.instance-input {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.instance-input input {
  width: 300px;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

canvas {
  width: 100%;
  height: 200px !important;
  max-height: 200px;
}
</style>
