<script setup>
import { onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

const props = defineProps({
  info: Object
})

Chart.register(...registerables)
Chart.defaults.font.family = 'Pretendard'

let chart

// 거래 가격 그래프 그리기
const drawChart = (houseInfo) => {
  if (chart) {
    chart.destroy()
  }
  const labels = houseInfo.listDeal.map(
    (deal) => `${deal.dealYear}-${String(deal.dealMonth).padStart(2, '0')}`,
  )
  const amounts = houseInfo.listDeal.map((deal) => parseFloat(deal.amount.replace(/,/g, '')))

  const ctx = document.getElementById('priceChart').getContext('2d')
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '거래가격 (만원)',
          data: amounts,
          borderColor: '#BBE9FD',
          borderWidth: 1,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
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
      },
      plugins: {
        title: {
          display: true,
          text: '거래가격 변화 (만원)',
          color: 'white',
        },
        legend: {
          display: false,
          labels: {
            color: 'white',
          },
        },
      },
    },
  })
}

watch(()=>props.info, async (newInfo) => drawChart(newInfo))
onMounted(async () => drawChart(props.info))
</script>

<template>
  <canvas id="priceChart" height="200"></canvas>
</template>
