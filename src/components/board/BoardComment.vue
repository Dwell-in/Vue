<template>
  <div class="comment-section">
    <h3>댓글</h3>
    <div v-if="loginUser" class="comment-input-wrapper">
      <textarea v-model="newComment" placeholder="댓글을 입력하세요" rows="3" @input="onInput" />
      <div v-if="showActions" class="comment-actions">
        <button class="register" @click="addComment">등록</button>
        <button class="cancel" @click="cancelComment">취소</button>
      </div>
    </div>

    <div v-for="comment in comments" :key="comment.commentId" class="comment-item">
      <div class="meta">
        <div class="meta-left">
          <strong class="name">{{ comment.userName }}</strong>
          <div v-if="editTargetId === comment.commentId" class="edit-area">
            <textarea v-model="editContent" rows="3" />
            <div class="action-buttons">
              <button class="action" @click="submitEdit">저장</button>
              <button class="action cancel" @click="cancelEdit">취소</button>
            </div>
          </div>
          <p v-else class="content">{{ comment.content }}</p>
        </div>
        <div class="meta-right">
          <div class="time">{{ comment.regdate }}</div>
          <div class="action-buttons">
            <button
              v-if="loginUser?.id === comment.userId"
              class="action"
              @click="startEdit(comment)"
            >
              수정
            </button>
            <button
              v-if="loginUser?.id === comment.userId || loginUser?.role === 'ADMIN'"
              class="action"
              @click="deleteComment(comment.commentId)"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import { useLoginUserStore } from '@/stores/loginUser'

const props = defineProps({
  boardId: {
    type: Number,
    required: true,
  },
})

const editTargetId = ref(null)
const editContent = ref('')

const startEdit = (comment) => {
  editTargetId.value = comment.commentId
  editContent.value = comment.content
}

const cancelEdit = () => {
  editTargetId.value = null
  editContent.value = ''
}

const submitEdit = async () => {
  if (!editContent.value.trim()) return
  try {
    await api.put(`/api/v1/comment/${editTargetId.value}`, {
      commentId: editTargetId.value,
      content: editContent.value,
    })
    editTargetId.value = null
    editContent.value = ''
    await fetchComments()
  } catch (e) {
    console.error(e)
  }
}

const loginUser = useLoginUserStore()
const comments = ref([])
const newComment = ref('')
const showActions = ref(false)

const fetchComments = async () => {
  try {
    const res = await api.get(`/api/v1/comment/${props.boardId}`)
    comments.value = res.data.data
  } catch (e) {
    console.error(e)
  }
}

const addComment = async () => {
  if (!newComment.value.trim()) return
  try {
    await api.post('/api/v1/comment', {
      boardId: props.boardId,
      userId: loginUser.id,
      content: newComment.value,
    })
    newComment.value = ''
    showActions.value = false
    await fetchComments()
  } catch (e) {
    console.error(e)
  }
}

const deleteComment = async (commentId) => {
  const confirmed = window.confirm('댓글을 삭제하시겠습니까?')
  if (!confirmed) return
  try {
    await api.delete(`/api/v1/comment/${commentId}`)
    await fetchComments()
  } catch (e) {
    console.error(e)
  }
}

const cancelComment = () => {
  newComment.value = ''
  showActions.value = false
}

const onInput = () => {
  showActions.value = newComment.value.trim().length > 0
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.comment-section {
  width: 100%;
  border-top: 1px solid #e3e7eb;
  padding: 20px;
}

.comment-input-wrapper {
  position: relative;
  margin-bottom: 40px;
}

textarea {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  resize: vertical;
}

.comment-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
}

.register {
  background: #3c90e2;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9em;
}

.cancel {
  background: #ccc;
  color: #000;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9em;
}

.comment-item {
  border-top: 1px solid #ddd;
  padding: 12px 0 20px;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.meta-left {
  flex: 1;
}

.meta-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 120px;
  flex-shrink: 0;
}

.name {
  font-weight: bold;
  font-size: 0.95em;
}

.time {
  font-size: 0.85em;
  color: #999;
  margin-bottom: 6px;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.action {
  background: #3c90e2;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 0.8em;
}

.action.cancel {
  background: #ccc;
  color: black;
}

.edit-area {
  margin-top: 8px;
}

.edit-area textarea {
  width: 100%;
  padding: 8px;
  font-size: 0.95em;
  resize: vertical;
}

.content {
  margin-top: 8px;
  font-size: 1em;
}
</style>
