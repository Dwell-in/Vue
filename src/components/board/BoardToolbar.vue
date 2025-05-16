<script setup>
import { ref } from 'vue'

const keyword = ref('')

const emit = defineEmits('search')
const handleSearch = () => {
  emit('search', keyword.value)
  keyword.value = ''
}
</script>

<template>
  <div class="search">
    <input type="text" placeholder="제목, 내용" v-model="keyword" @keyup.enter="handleSearch" />
    <button class="" @click="handleSearch">검색</button>
  </div>
</template>

<style scoped>
.search {
  width: 50%;
  height: 40px;
  display: flex;
  gap: 1%;
  font-size: 0.8em;
  margin: 40px;
}
* {
  font-size: 1em;
}
input {
  width: 100%;
  height: 40px;
  border: 1px solid #e3e7eb;
  text-indent: 10px;
}
button {
  width: 15%;
  flex-shrink: 0;
  background: #8f99a2;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
