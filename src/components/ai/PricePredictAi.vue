<template>
  <MarkDownPasser v-if="result" :text="result" />
  <div v-else class="loading">
    <i class="fa-solid fa-spinner fa-spin fa-fade fa-5x"></i>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import MarkDownPasser from '@/components/dwellog/MarkDownPasser.vue'

const props = defineProps({
  aptSeq: {
    type: String,
    required: true,
  },
})

const result = ref('')

onMounted(async () => {
  try {
    const res = await api.post('/api/v1/predict/price', { aptSeq: props.aptSeq })
    result.value = res.data.data.message
  } catch (err) {
    result.value = '예측 중 오류 발생'
    console.error(err)
  }
})
</script>

<style scoped>
.loading {
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
