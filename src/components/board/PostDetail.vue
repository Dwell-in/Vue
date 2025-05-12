<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/lib/api'

const route = useRoute()
const router = useRouter()
const board = ref(null)

const fetchBoardDetail = async () => {
  const boardId = route.query['board-id']
  try {
    const res = await api.get(`/api/v1/board/board-detail/${boardId}`)
    board.value = res.data.data.board
  } catch (e) {
    console.error('게시글 상세 조회 실패:', e)
    alert('게시글 정보를 불러오지 못했습니다.')
  }
}

onMounted(() => {
  fetchBoardDetail()
})

const goToUpdate = () => {
  router.push({ path: '/board/post-update', query: { boardId: board.value.boardId } })
}

const handleDelete = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await api.post(`/api/v1/board/board-delete/${board.value.boardId}`)
    alert('삭제되었습니다.')
    router.push('/board/list')
  } catch (e) {
    console.error('삭제 실패:', e)
    alert('삭제에 실패했습니다.')
  }
}
</script>

<template>
  <div v-if="board" class="board-detail container">
    <h2 class="text-center mb-4">공지사항</h2>

    <table class="table table-bordered">
      <tbody>
        <tr>
          <th class="bg-light" style="width: 15%">제목</th>
          <td>{{ board.title }}</td>
        </tr>
        <tr>
          <th class="bg-light">작성자</th>
          <td>{{ board.userName }}</td>
        </tr>
        <tr>
          <th class="bg-light">조회수</th>
          <td>{{ board.viewCount }}</td>
        </tr>
        <tr>
          <th class="bg-light">작성일</th>
          <td>{{ board.regTime }}</td>
        </tr>
        <tr>
          <th class="bg-light">내용</th>
          <td style="min-height: 200px; white-space: pre-wrap" v-html="board.content"></td>
        </tr>
      </tbody>
    </table>
    <div class="d-flex justify-content-end gap-2">
      <button class="btn btn-warning" @click="goToUpdate">수정</button>
      <button class="btn btn-danger" @click="handleDelete">삭제</button>
      <router-link to="/board/list" class="btn btn-secondary">목록으로</router-link>
    </div>
  </div>
</template>

<style scoped>
.board-detail {
  padding: 2rem;
}
.meta {
  display: flex;
  gap: 2rem;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}
.content {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
