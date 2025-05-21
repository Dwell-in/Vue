<template>
  <svg
    class="heart-toggle"
    @click="toggle"
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    :fill="isOn ? '#ff69b4' : 'none'"
    stroke="#ff69b4"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
           a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78
           a5.5 5.5 0 0 0 0-7.78z"
    />
  </svg>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/lib/api'

const props = defineProps({
  aptSeq: Number,
  initial: Boolean,
})

const emit = defineEmits(['toggled'])

const isOn = ref(props.initial ?? false)

const fetchStarred = async () => {
  try {
    const res = await api.get(`/api/v1/house/view/starred/${props.aptSeq}`)
    isOn.value = res.data.data.isStarred
  } catch (e) {
    console.warn('즐겨찾기 상태 조회 실패', e)
  }
}

const toggle = async () => {
  const url = `/api/v1/starred/${props.aptSeq}`
  try {
    if (isOn.value) {
      const confirmed = confirm('정말 관심지역에서 삭제하시겠습니까?')
      if (!confirmed) return
      await api.delete(url)
      isOn.value = false
    } else {
      await api.post(url)
      isOn.value = true
    }
    emit('toggled', isOn.value)
  } catch (e) {
    alert('즐겨찾기 처리 중 오류 발생')
    console.error(e)
  }
}

//   const handleToggle = (starred) => {
//   if (!starred) {
//     emit('remove', apt.aptSeq)
//   }
//}

onMounted(() => {
  fetchStarred()
})
</script>

<style scoped>
.heart-toggle {
  cursor: pointer;
  transition: transform 0.2s ease;
}
.heart-toggle:hover {
  transform: scale(1.1);
}
</style>
<!-- <HeartToggle :aptSeq="apt.aptSeq" @toggled="handleToggle" /> -->
