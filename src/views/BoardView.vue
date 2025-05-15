<template>
  <div>
    <component
      :is="currentComponent"
      :postId="selectedPostId"
      @view-detail="handleViewDetail"
      @write-post="handleWritePost"
      @edit-post="handleEditPost"
      @back-to-main="handleBackToMain"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 4개 컴포넌트 import
import BoardMain from '@/components/board/BoardMain.vue'
import PostDetail from '@/components/board/PostDetail.vue'
import PostWrite from '@/components/board/PostWrite.vue'
import PostUpdate from '@/components/board/PostUpdate.vue'

// BoardView 아래서 컴포넌트들만 전환
const currentView = ref('main')
const selectedPostId = ref(null)

const currentComponent = computed(() => {
  switch (currentView.value) {
    case 'detail':
      return PostDetail
    case 'write':
      return PostWrite
    case 'update':
      return PostUpdate
    default:
      return BoardMain
  }
})

// 이벤트 핸들러
const handleViewDetail = (id) => {
  selectedPostId.value = id
  currentView.value = 'detail'
}

const handleWritePost = () => {
  currentView.value = 'write'
}

const handleEditPost = (id) => {
  selectedPostId.value = id
  currentView.value = 'update'
}

const handleBackToMain = () => {
  currentView.value = 'main'
  selectedPostId.value = null
}
</script>

<style scoped>
* {
  color: black;
}

main {
  margin-top: 65px;
  min-height: calc(100vh - 215px);
}
</style>
