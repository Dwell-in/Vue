<script setup>
import BoardToolbar from './BoardToolbar.vue'
defineProps({
  boards: Object,
})

const emit = defineEmits('search')
const search = (keyword) => {
  emit('search', keyword)
}
</script>

<template>
  <BoardToolbar @search="search"></BoardToolbar>
  <table>
    <thead>
      <tr>
        <th>번호</th>
        <th>제목</th>
        <th>등록일</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(board, index) in boards" :key="index">
        <td>{{ board.boardId }}</td>
        <td>
          <router-link :to="`board/detail?category=${board.categoryId}&boardId=${board.boardId}`">
            {{ board.title }}
          </router-link>
        </td>
        <td>{{ board.regTime.substring(0, 10) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 100%;
  border-top: 1px solid #24282b;
  border-collapse: collapse;
  font-size: 0.8em;
}
* {
  font-size: 1em;
}
th {
  background: #fafbfc;
}
th,
td {
  height: 60px;
  color: #4f5a66;
}
tr {
  border-bottom: 1px solid #e3e7eb;
}
td {
  text-align: center;
}
th:first-child,
td:first-child {
  width: 140px;
}
th:nth-child(2),
td:nth-child(2) {
  width: 890px;
}
td:nth-child(2) {
  text-align: start;
}
td:nth-child(3) {
  font-size: 0.9em;
}
a {
  color: #4f5a66;
}
a:hover {
  text-decoration: underline;
}
</style>
