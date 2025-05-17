<script setup>
import { ref, onMounted, watch } from 'vue'
import { roadviewOn } from '@/lib/kakao'

const props = defineProps({
  info: Object
})
const roadviewContainer = ref()

watch(()=>props.info, async (newInfo) => roadviewOn(roadviewContainer.value, newInfo.lat, newInfo.lon))
onMounted(async () => roadviewOn(roadviewContainer.value, props.info.lat, props.info.lon))
</script>
<template>
  <div ref="roadviewContainer"></div>
</template>
