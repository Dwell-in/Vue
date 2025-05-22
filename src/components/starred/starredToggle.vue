<template>
  <svg
    class="heart-toggle"
    @click="toggle"
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    :fill="isStarred ? '#ff69b4' : 'none'"
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
import { onMounted, ref, watch } from 'vue'
import { useStarredStore } from '@/components/stores/starred'

const props = defineProps({
  apt: {
    type: Object,
    required: true,
  },
})

const starredStore = useStarredStore()

// 관심 아파트인지 여부 확인 (apt.aptSeq 기준)
const isStarred = ref()

const toggle = async () => {
  try {
    if (isStarred.value) {
      const confirmDelete = confirm('정말 관심지역에서 삭제하시겠습니까?')
      if (!confirmDelete) return
      await starredStore.removeStarred(props.apt.aptSeq)
    } else {
      console.log(props.apt)
      await starredStore.addStarred(props.apt)
    }
  } catch (e) {
    alert('즐겨찾기 처리 중 오류 발생')
    console.error(e)
  }
}

const isStarredSetting = () => {
  console.log(props.apt)
  isStarred.value = starredStore.starredes.some((item) => item.aptSeq === props.apt?.aptSeq)
}
onMounted(async () => {
  // 최초에 관심 목록이 비어있으면 서버에서 가져오기
  if (!starredStore.starredes?.length) {
    await starredStore.fetchStarred()
  }
  isStarredSetting()
})

watch(
  () => starredStore.starredes,
  () => isStarredSetting(),
  { deep: true },
)
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
