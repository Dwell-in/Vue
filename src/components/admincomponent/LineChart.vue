<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const canvas = ref(null)
let chartInstance = null

const props = defineProps({
  series: {
    type: Array,
    default: () => [],
  },
})

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  chartInstance = new Chart(canvas.value, {
    type: 'line',
    data: {
      labels: props.series.map((p) => new Date(p.x).toLocaleString()),
      datasets: [
        {
          label: '',
          data: props.series.map((p) => p.y),
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 5,
            callback: (value, index) => {
              const raw = props.series[index]?.x
              if (!raw) return ''
              const date = new Date(raw)

              const hour = String(date.getHours()).padStart(2, '0')
              const min = String(date.getMinutes()).padStart(2, '0')
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const day = String(date.getDate()).padStart(2, '0')

              // 값의 개수가 10개 고정이므로 범위는 series 간격으로 유추
              const rangeMinutes =
                props.series[1]?.x && props.series[0]?.x
                  ? (new Date(props.series[0].x) - new Date(props.series[1].x)) / 60000
                  : 0

              // 간격이 30분 이상이면 날짜까지 표시
              console.log(rangeMinutes)
              if (rangeMinutes >= 30) return `${month}/${day} ${hour}:${min}`
              return `${hour}:${min}`
            },
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              if (value >= 1_000_000) return value / 1_000_000 + 'M'
              if (value >= 1_000) return value / 1_000 + 'K'
              return value
            },
            maxTicksLimit: 5,
          },
        },
      },
    },
  })
}

onMounted(renderChart)
watch(() => props.series, renderChart, { deep: true })
onBeforeUnmount(() => chartInstance?.destroy())
</script>

<style scoped>
canvas {
  width: 100%;
  height: 200px;
}
</style>
