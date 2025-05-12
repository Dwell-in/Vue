<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/api'
import BoardToolbar from '@/components/board/BoardToolbar.vue'

defineProps(['categoryId'])

const router = useRouter()
const postList = ref([])

const fetchPostList = async () => {
  try {
    const res = await api.get('/api/v1/board/post-list')
    postList.value = res.data.data.data
  } catch (e) {
    console.error(e)
  }
}

const goDetail = async (boardId) => {
  router.push(`/board/post-detail?board-id=${boardId}`)
}

onMounted(async () => {
  await fetchPostList()
  console.log(postList.value[0])
})

const handleSearch = (keyword) => {
  fetchPostList(keyword)
}
</script>

<template>
  <BoardToolbar @search="handleSearch" />
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
          <a href="#" @click.prevent="goDetail(item.boardId)">
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
