<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'

const emit = defineEmits(['back-to-main'])

const props = defineProps({ postId: Number })
const boardId = props.postId

const title = ref('')
const content = ref('')
const userName = ref('')
const categoryId = ref(1)
const userId = ref(1)

const fetchPost = async () => {
  try {
    console.log(boardId)
    const res = await api.get(`/api/v1/board/board-detail/${boardId}`)
    const post = res.data.data.board
    title.value = post.title
    content.value = post.content
    userName.value = post.userName
    userId.value = post.userId
    categoryId.value = post.categoryId
  } catch (error) {
    console.error(error)
    alert('게시글 정보를 불러오는 데 실패했습니다.')
  }
}

onMounted(fetchPost)

const handleUpdate = async () => {
  try {
    const payload = {
      categoryId: categoryId.value,
      title: title.value,
      content: content.value,
      userId: userId.value,
      userName: userName.value,
    }
    await api.post(`/api/v1/board/board-update/${boardId}`, payload)
    alert('수정이 완료되었습니다.')
    emit('back-to-main')
  } catch (error) {
    console.error(error)
    alert('수정 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">공지사항 수정</h2>
    </div>

    <form @submit.prevent="handleUpdate">
      <input type="hidden" v-model="categoryId" />
      <div class="mb-3">
        <label for="title" class="form-label">제목</label>
        <input type="text" id="title" v-model="title" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="userName" class="form-label">작성자</label>
        <input type="hidden" v-model="userId" />
        <input type="text" id="userName" v-model="userName" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="content" class="form-label">내용</label>
        <textarea id="content" v-model="content" rows="8" class="form-control" required></textarea>
      </div>

      <div class="text-end">
        <button type="submit" class="btn btn-primary">수정</button>
        <button type="button" class="btn btn-secondary" @click="emit('back-to-main')">취소</button>
      </div>
    </form>
  </div>
</template>
