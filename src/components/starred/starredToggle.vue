<template>
  <i
    class="fa-star heart-toggle"
    style="color: #ffdf6b"
    :class="isStarred ? 'fa-solid' : 'fa-regular'"
    @click="toggle"
  ></i>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useStarredStore } from '@/stores/starred'

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
      await starredStore.addStarred(props.apt)
    }
  } catch (e) {
    alert('즐겨찾기 처리 중 오류 발생')
    console.error(e)
  }
}

const isStarredSetting = () => {
  isStarred.value = starredStore.starredes?.some((item) => item.aptSeq === props.apt?.aptSeq)
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
  transform: scale(1.2);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.heart-toggle:hover {
  transform: scale(1.3);
}
</style>
