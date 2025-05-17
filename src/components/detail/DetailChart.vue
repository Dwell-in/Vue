<script setup>
import { onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

const props = defineProps({
  info: Object,
  chartType: {
    type: String,
    default: 'line'
  },
  fontSize: {
    type: Number,
    default: 14
  }
})

let chart

// 거래 가격 그래프 그리기
const drawChart = (houseInfo) => {
  Chart.register(...registerables)
  Chart.defaults.font.family = 'Pretendard'
  Chart.defaults.font.size = props.fontSize
  if (chart) {
    chart.destroy()
  }

  const labels = houseInfo.listDeal.map(
    (deal) => `${deal.dealYear}-${String(deal.dealMonth).padStart(2, '0')}`,
  )
  const amounts = houseInfo.listDeal.map((deal) => parseFloat(deal.amount.replace(/,/g, '')))

  const chartOptions = {
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: '거래가격 변화 (만원)',
        color: 'white',
        font: {
          size: 20  // 👈 원하는 크기로 설정 (예: 14~16 추천)
        }
      },
      legend: {
        display: false,
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        bodyFont: {
          size: 14 // 👈 텍스트 크기 줄이기
        },
        padding: 6, // 👈 안쪽 여백 줄이기
        backgroundColor: 'rgba(0,0,0,0.7)', // 필요시 배경 조정
        titleFont: {
          size: 14 // 👈 타이틀 텍스트도 줄일 수 있음
        }
      },
    },
  }

  // type이 'line'일 때만 scales 추가
  if (props.chartType === 'line') {
    chartOptions.responsive = true;
    chartOptions.scales = {
      x: {
        ticks: {
          color: 'white',
        },
      },
      y: {
        ticks: {
          color: 'white',
          callback: (value) => value,
        },
      },
    }
  }

  const ctx = document.getElementById('priceChart').getContext('2d')
  chart = new Chart(ctx, {
    type: props.chartType,
    data: {
      labels: labels,
      datasets: [
        {
          label: '거래가격 (만원)',
          data: amounts,
          borderColor: '#BBE9FD',
          borderWidth: 1,
          pointRadius: 0,
          backgroundColor: ['#BBE9FD', '#4AB5E6', '#010B1B', '#004768'],
          hoverOffset: 20
        },
      ],
    },
    options: chartOptions
  })
}

watch(() => props.info, async (newInfo) => drawChart(newInfo))
onMounted(async () => drawChart(props.info))
</script>

<template>
  <canvas id="priceChart" height="280" width="280"></canvas>
</template>
