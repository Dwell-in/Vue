<script setup>
import { ref } from 'vue'
import api from '@/lib/api'

const emit = defineEmits(['back-to-main'])

const userId = ref(1)
const userName = ref('')
const categoryId = ref(1)

const title = ref('')
const content = ref('')

const handleSubmit = async () => {
  try {
    const payload = {
      categoryId: categoryId.value,
      title: title.value,
      userId: userId.value,
      userName: userName.value,
      content: content.value,
    }

    await api.post('/api/v1/board/board-write', payload)
    alert('등록이 완료되었습니다.')
    emit('back-to-main')
  } catch (error) {
    console.error(error)
    alert('등록 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">공지사항 등록</h2>
    </div>

    <form @submit.prevent="handleSubmit">
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
        <button type="submit" class="btn btn-primary">등록</button>
        <button type="button" class="btn btn-secondary" @click="emit('back-to-main')">취소</button>
      </div>
    </form>
  </div>
</template>
