<script setup>
import { Radar } from 'vue-chartjs'
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler)

const props = defineProps({
  labels: Array,
  data: Array,
})

const safeMax = computed(() => {
  return Math.max(...(Array.isArray(props.data) ? props.data : [0]), 5)
})
</script>

<template>
  <div class="radar-wrapper">
    <Radar
      :data="{
        labels: props.labels,
        datasets: [
          {
            label: '주변 시설 개수',
            data: props.data,
            fill: true,
            backgroundColor: 'rgba(72, 138, 255, 0.3)',
            borderColor: '#488aff',
            borderWidth: 2,
            pointBackgroundColor: '#488aff',
          },
        ],
      }"
      :options="{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            ticks: { display: false },
            pointLabels: { color: 'white', font: { size: 12 } },
            grid: { color: '#444' },
            angleLines: { color: '#444' },
            suggestedMin: 0,
            suggestedMax: safeMax.value,
          },
        },
        plugins: { legend: { display: false } },
      }"
    />
  </div>
</template>
<style scoped>
.radar-wrapper {
  width: 100%;
  max-width: 350px;
  height: 250px;
  margin: 0 auto;
  position: relative;
}

.radar-wrapper canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
