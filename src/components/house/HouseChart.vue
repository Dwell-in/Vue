<script setup>
import { onMounted, ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

const chartId = ref(`chart-${Math.random().toString(36)}`)
const props = defineProps({
  info: Object,
  chartType: {
    type: String,
    default: 'line',
  },
  fontSize: {
    type: Number,
    default: 14,
  },
})

let chart
let areaToAmounts = {}
let areaToLabels = {}
const keys = ref()
const key = ref()

const setData = (houseInfo) => {
  houseInfo.listDeal.forEach((deal) => {
    const area = deal.exclu // 면적
    const amount = parseFloat((parseFloat(deal.amount.replace(/,/g, '')) / 10000).toFixed(2))
    const label = `${deal.dealYear}-${String(deal.dealMonth).padStart(2, '0')}`

    if (!areaToAmounts[area]) {
      areaToAmounts[area] = []
      areaToLabels[area] = []
    }

    areaToAmounts[area].push(amount)
    areaToLabels[area].push(label)
  })
  keys.value = Object.keys(areaToAmounts)
    .map(parseFloat) // 문자열 → 숫자
    .sort((a, b) => a - b) // 오름차순 정렬
    .map(String)
  key.value = keys.value[0]
}

// 거래 가격 그래프 그리기
const drawChart = () => {
  Chart.register(...registerables)
  Chart.defaults.font.family = 'Pretendard'
  Chart.defaults.font.size = props.fontSize
  if (chart) {
    chart.destroy()
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '거래가격 변화 (억)',
        color: 'white',
        font: {
          size: 20, // 👈 원하는 크기로 설정 (예: 14~16 추천)
        },
      },
      legend: {
        display: false,
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        bodyFont: {
          size: 14, // 👈 텍스트 크기 줄이기
        },
        padding: 6, // 👈 안쪽 여백 줄이기
        backgroundColor: 'rgba(0,0,0,0.7)', // 필요시 배경 조정
        titleFont: {
          size: 14, // 👈 타이틀 텍스트도 줄일 수 있음
        },
      },
    },
  }

  // type이 'line'일 때만 scales 추가
  if (props.chartType === 'line') {
    chartOptions.scales = {
      x: {
        ticks: {
          color: 'white',
        },
      },
      y: {
        ticks: {
          color: 'white',
          callback: (value) => parseFloat(value).toFixed(2),
        },
      },
    }
  }

  chart = new Chart(chartId.value, {
    type: props.chartType,
    data: {
      labels: areaToLabels[key.value],
      datasets: [
        {
          label: '거래가격 (억)',
          data: areaToAmounts[key.value],
          borderColor: '#BBE9FD',
          borderWidth: 1,
          pointRadius: 1,
          pointHitRadius: 10,
          backgroundColor: ['#BBE9FD', '#4AB5E6', '#010B1B', '#004768'],
          hoverOffset: 20,
        },
      ],
    },
    options: chartOptions,
  })
}

watch(
  () => props.info,
  async (newInfo) => {
    setData(newInfo)
    drawChart()
  },
)
watch(key, async () => {
  drawChart()
})
onMounted(async () => {
  setData(props.info)
  drawChart()
})
</script>

<template>
  <div class="areaLabels">
    <div
      v-for="(k, index) in keys"
      :key="index"
      @click="key = keys[index]"
      :class="{ active: keys[index] == key }"
    >
      {{ k }}
    </div>
  </div>
  <canvas :id="chartId" height="10" width="12"></canvas>
</template>

<style lang="scss">
.areaLabels {
  display: flex;
  gap: 10px;
  & * {
    font-size: 0.8em;
    cursor: pointer;
    display: flex;
    align-items: center;

    &.active {
      background-color: #3b3b3b;
      border-radius: 10px;
      padding: 5px 10px;
    }
  }
}
</style>
