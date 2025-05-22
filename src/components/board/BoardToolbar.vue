<script setup>
import { ref } from 'vue'

const keyword = ref('')
const selectedKey = ref('title') // 기본값은 title로

const emit = defineEmits(['search'])
const handleSearch = () => {
  emit('search', { key: selectedKey.value, value: keyword.value.trim() })
}
</script>

<template>
  <div class="search">
    <select v-model="selectedKey">
      <option value="title">제목</option>
      <option value="content">내용</option>
      <option value="userName">작성자</option>
    </select>

    <input type="text" placeholder="검색어 입력" v-model="keyword" @keyup.enter="handleSearch" />
    <button @click="handleSearch">검색</button>
  </div>
</template>

<style scoped>
select{
  border: 1px solid #E3E7EB;
}
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
