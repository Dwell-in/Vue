<script setup>
import { ref } from 'vue'
import AddressSearchEngine from './searchEngine/AddressSearchEngine.vue'

defineProps(['hovered'])

const selectedKey = ref('add')

const engineRef = ref(null)
const handleSubmit = () => {
  engineRef.value.handleSubmit()
}
</script>

<template>
  <form class="search" :class="{ hovered: hovered }" @submit.prevent="handleSubmit">
    <select name="key" v-model="selectedKey">
      <option value="add">주소 검색</option>
      <option value="apt">건물명 검색</option>
      <option value="board">게시판</option>
    </select>
    <div class="border-div"></div>
    <div>
      <AddressSearchEngine v-if="selectedKey === 'add'" ref="engineRef" />
    </div>
    <button class="searchBtn" type="submit">
      <img alt="search" src="@/assets/img/search.png" />
    </button>
  </form>
</template>

<style scoped>
.search {
  width: 450px;
  height: 40px;
  background-color: #c9d6df;
  border-radius: 20px;
  display: flex;
  align-items: center;
  position: relative;
}
.search *:focus {
  outline: none;
}
.search:not(.hovered) {
  width: 60px;
  transition-delay: 0.5s;
}
.search:not(.hovered) *:not(.searchBtn, .searchBtn *) {
  opacity: 0;
  transition-delay: 0.5s;
}
.search select {
  width: 125px;
  height: 100%;
  padding: 0 20px;
  flex-shrink: 0;
  cursor: pointer;
  border: none;
  background-color: transparent;
  text-align: center;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.search div {
  width: 100%;
  height: 100%;
  position: relative;
  align-items: center;
}
.searchBtn {
  background-color: transparent;
  border: none;
  height: 80%;
  position: absolute;
  right: 10px;
  cursor: pointer;
}
.searchBtn img {
  width: 100%;
  height: 100%;
}
.search .border-div {
  width: 1px;
  height: 25px;
  border-left: 1px solid #52616b;
}
:deep(.search-input) {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  border: none;
  background-color: transparent;
}
</style>
