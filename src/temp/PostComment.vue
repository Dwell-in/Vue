<template>
  <div class="mt-5">
    <h5>댓글</h5>

    <div class="mb-3">
      <textarea
        v-model="newComment"
        rows="2"
        class="form-control"
        placeholder="댓글을 입력하세요"
      />
      <button class="btn btn-primary mt-2" @click="addComment">등록</button>
    </div>

    <ul class="list-group">
      <li
        v-for="comment in comments"
        :key="comment.commentId"
        class="list-group-item d-flex justify-content-between align-items-start"
      >
        <div class="flex-grow-1">
          <div class="fw-bold">작성자 ID: {{ comment.userId }}</div>
          <div v-if="editingId === comment.commentId">
            <textarea v-model="editingContent" rows="2" class="form-control" />
            <div class="mt-2">
              <button class="btn btn-success btn-sm me-2" @click="updateComment">저장</button>
              <button class="btn btn-secondary btn-sm" @click="cancelEdit">취소</button>
            </div>
          </div>
          <div v-else>{{ comment.content }}</div>
        </div>
        <div>
          <button class="btn btn-outline-secondary btn-sm me-2" @click="startEdit(comment)">
            수정
          </button>
          <button class="btn btn-outline-danger btn-sm" @click="deleteComment(comment.commentId)">
            삭제
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'

const props = defineProps({
  boardId: Number,
})

const comments = ref([])
const newComment = ref('')
const editingId = ref(null)
const editingContent = ref('')

const fetchComments = async () => {
  try {
    const res = await api.get(`/api/v1/comment/${props.boardId}`)
    comments.value = res.data.data
  } catch (e) {
    console.error('댓글 조회 실패:', e)
    alert('댓글을 불러오지 못했습니다.')
  }
}

const addComment = async () => {
  if (!newComment.value.trim()) return
  try {
    await api.post('/api/v1/comment', {
      boardId: props.boardId,
      userId: 1, // 테스트용. 실제 로그인 정보로 대체해야 함
      content: newComment.value,
    })
    newComment.value = ''
    fetchComments()
  } catch (e) {
    console.error('댓글 등록 실패:', e)
    alert('댓글 등록에 실패했습니다.')
  }
}

const startEdit = (comment) => {
  editingId.value = comment.commentId
  editingContent.value = comment.content
}

const cancelEdit = () => {
  editingId.value = null
  editingContent.value = ''
}

const updateComment = async () => {
  try {
    await api.put(`/api/v1/comment/${editingId.value}`, {
      commentId: editingId.value,
      boardId: props.boardId,
      userId: 1, // 임시로 구성, 현재 로그인한 유저 정보 받아와야 함
      content: editingContent.value,
      like: 0,
      dislike: 0,
      reg_date: '',
    })
    cancelEdit()
    fetchComments()
  } catch (e) {
    console.error('댓글 수정 실패:', e)
    alert('댓글 수정에 실패했습니다.')
  }
}

const deleteComment = async (commentId) => {
  if (!confirm('댓글을 삭제하시겠습니까?')) return
  try {
    await api.delete(`/api/v1/comment/${commentId}`)
    fetchComments()
  } catch (e) {
    console.error('댓글 삭제 실패:', e)
    alert('댓글 삭제에 실패했습니다.')
  }
}

onMounted(fetchComments)
</script>
