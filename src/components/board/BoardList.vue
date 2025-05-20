<script setup>
import { useRoute } from 'vue-router'
import BoardToolbar from './BoardToolbar.vue'
import { useLoginUserStore } from '@/stores/loginUser'

defineProps({
  boards: Object,
  offset: Number,
})

const emit = defineEmits(['search'])
const search = ({ key, value }) => {
  emit('search', { key, value })
}
const route = useRoute()

const loginUser = useLoginUserStore()
</script>

<template>
  <div class="header">
    <BoardToolbar @search="search"></BoardToolbar>
    <router-link
      v-if="loginUser && (route.params.categoryId != 1 || loginUser.role === 'ADMIN')"
      class="writeBtn"
      :to="`/board/write/${route.params.categoryId}`"
    >
      글쓰기
    </router-link>
  </div>
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
        <td>{{ offset + index + 1 }}</td>
        <td>
          <router-link :to="`/board/detail/${board.boardId}/${board.categoryId}`">
            {{ board.title }}
          </router-link>
        </td>
        <td>{{ board.regTime.substring(0, 10) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}
.writeBtn {
  background: #3c90e2;
  color: #fff;
  border: none;
  padding: 5px 15px;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 0;
  font-size: 0.8em;
}
table {
  width: 100%;
  border-top: 1px solid #24282b;
  border-collapse: collapse;
  font-size: 0.8em;
  margin-bottom: 60px;
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
