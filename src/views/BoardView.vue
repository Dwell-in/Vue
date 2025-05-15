<template>
  <Header />
  <main>
    <component
      :is="currentComponent"
      :postId="selectedPostId"
      @view-detail="handleViewDetail"
      @write-post="handleWritePost"
      @edit-post="handleEditPost"
      @back-to-main="handleBackToMain"
    />
  </main>

  <Footer />
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer1.vue'
import BoardMain from '@/components/board/BoardMain.vue'
import PostDetail from '@/components/board/PostDetail.vue'
import PostWrite from '@/components/board/PostWrite.vue'
import PostUpdate from '@/components/board/PostUpdate.vue'

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
main {
  max-width: 1920px;
  min-height: calc(100vh - 215px);
  margin-top: 65px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
