<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const keyword = ref('')
const emit = defineEmits(['search'])
const router = useRouter()

const goToWrite = () => {
  router.push({ path: '/board/post-write' })
}

const handleSearch = () => {
  emit('search', keyword.value)
}
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <input
      type="text"
      class="form-control w-50"
      placeholder="검색어를 입력하세요"
      v-model="keyword"
      @keyup.enter="handleSearch"
    /><br />
    <button class="btn btn-primary" @click="goToWrite">등록</button>
  </div>
</template>
