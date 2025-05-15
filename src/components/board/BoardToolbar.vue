<script setup>
import { ref } from 'vue'

const keyword = ref('')
const emit = defineEmits(['search', 'write-click'])

const handleSearch = () => {
  emit('search', keyword.value)
}

const handleWrite = () => {
  emit('write-click')
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
    />
    <button class="btn btn-primary" @click="handleWrite">등록</button>
  </div>
</template>
