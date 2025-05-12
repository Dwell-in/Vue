<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/lib/api'

const route = useRoute()
const router = useRouter()

const boardId = route.query.boardId

const title = ref('')
const userName = ref('')
const userId = ref(1) // 실제 로그인 정보에서 받아와야 함
const categoryId = ref(1)
const content = ref('')

const fetchBoard = async () => {
  try {
    const res = await api.get(`/api/v1/board/board-detail/${boardId}`)
    const board = res.data.data.board
    title.value = board.title
    userName.value = board.userName
    userId.value = board.userId
    categoryId.value = board.categoryId
    content.value = board.content
  } catch (e) {
    console.error('불러오기 실패:', e)
    alert('게시글 정보를 불러오지 못했습니다.')
  }
}

const handleUpdate = async () => {
  try {
    const payload = {
      boardId: parseInt(boardId),
      title: title.value,
      userId: userId.value,
      userName: userName.value,
      categoryId: categoryId.value,
      content: content.value,
    }

    await api.post(`/api/v1/board/board-update/${boardId}`, payload)
    alert('수정이 완료되었습니다.')
    router.push('/board/list')
  } catch (e) {
    console.error('수정 실패:', e)
    alert('수정에 실패했습니다.')
  }
}

onMounted(() => {
  fetchBoard()
})
</script>

<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">공지사항 수정</h2>
      <RouterLink to="/board/list" class="btn btn-secondary">목록</RouterLink>
    </div>

    <form @submit.prevent="handleUpdate">
      <input type="hidden" v-model="boardId" />
      <input type="hidden" v-model="categoryId" />

      <div class="mb-3">
        <label for="title" class="form-label">제목</label>
        <input type="text" id="title" class="form-control" v-model="title" required />
      </div>

      <div class="mb-3">
        <label for="userName" class="form-label">작성자</label>
        <input type="email" id="userName" class="form-control" v-model="userName" readonly />
        <input type="hidden" v-model="userId" />
      </div>

      <div class="mb-3">
        <label for="content" class="form-label">내용</label>
        <textarea id="content" class="form-control" v-model="content" rows="8" required></textarea>
      </div>

      <div class="text-end">
        <button type="submit" class="btn btn-primary">수정 완료</button>
      </div>
    </form>
  </div>
</template>
