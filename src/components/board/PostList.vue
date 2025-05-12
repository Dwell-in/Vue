<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
defineProps(['categoryId'])

const postList = ref([])

const fetchPostList = async () => {
  try {
    const res = await api.get('/api/v1/board/post-list')
    postList.value = res.data.data.data
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  await fetchPostList()
  console.log(postList.value[0])
})
</script>

<template>
  <table class="table table-hover table-striped text-center align-middle">
    <thead class="table-light">
      <tr>
        <th>번호</th>
        <th>제목</th>
        <th>조회수</th>
        <th>작성일</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in postList" :key="item.boardId">
        <td>{{ index + 1 }}</td>
        <td class="text-start ps-4">
          <a href="#" class="text-decoration-none text-dark board-link" :data-id="item.boardId">
            {{ item.title }}
          </a>
        </td>
        <td>{{ item.viewCount }}</td>
        <td>{{ item.regTime }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
