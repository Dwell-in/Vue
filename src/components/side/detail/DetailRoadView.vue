<script setup>
import { ref, watch, onMounted } from 'vue'
import { roadviewOn } from '@/lib/kakao'
import { state } from '@/lib/kakao'

const roadviewContainer = ref()

watch(state, async () => roadviewOn(roadviewContainer.value, state.info.lat, state.info.lon))
onMounted(async () => roadviewOn(roadviewContainer.value, state.info.lat, state.info.lon))
</script>
<template>
  <div class="info-roadview" ref="roadviewContainer"></div>
</template>

<style scoped>
.info-roadview {
  height: 25vh;
  margin: 0 auto;
  flex-shrink: 0;
  border-radius: 20px;
}
</style>
