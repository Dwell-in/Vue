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
      <button class="btn btn-secondary" @click="emit('back-to-main')">목록으로</button>
    </div>
    <PostComment :board-id="board.boardId" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import PostComment from './PostComment.vue'

const props = defineProps({
  postId: Number,
})

const emit = defineEmits(['back-to-main', 'edit-post'])

const board = ref(null)

const fetchBoardDetail = async () => {
  try {
    const res = await api.get(`/api/v1/board/board-detail/${props.postId}`)
    board.value = res.data.data.board
  } catch (e) {
    console.error('게시글 상세 조회 실패:', e)
    alert('게시글 정보를 불러오지 못했습니다.')
  }
}

onMounted(fetchBoardDetail)

const goToUpdate = () => {
  console.log(board.value.boardId)
  emit('edit-post', board.value.boardId)
}

const handleDelete = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await api.post(`/api/v1/board/board-delete/${board.value.boardId}`)
    alert('삭제되었습니다.')
    emit('back-to-main')
  } catch (e) {
    console.error('삭제 실패:', e)
    alert('삭제에 실패했습니다.')
  }
}
</script>
<style scoped>
.board-detail {
  padding: 2rem;
}
</style>
