<script setup>
import { ref } from 'vue'
import '@vueform/slider/themes/default.css'
import Slider from '@vueform/slider'

const priceRange = ref([0, 50000])
</script>

<template>
  <div>
    <div class="slider-container">
      <p>매매가: {{ priceRange[0] }}만원 ~ {{ priceRange[1] }}만원</p>
      <Slider
        v-model="priceRange"
        :min="0"
        :max="50000"
        :step="100"
        :tooltip="true"
      />
    </div>
  </div>
</template>


<style lang="scss" scoped>
.slider-container {
  padding: 20px;
  background: #111;
  color: white;
}
</style>
