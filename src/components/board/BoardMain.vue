<script setup>
import PostList from '@/components/board/PostList.vue'
import { ref } from 'vue'

const props = defineProps({
  postId: Number,
})

const categoryId = ref(1)
const emit = defineEmits(['view-detail', 'write-post', 'edit-post', 'back-to-main'])

const onSelectPost = (id) => {
  emit('view-detail', id)
}
const onWritePost = () => {
  emit('write-post')
}
</script>

<template>
  <div class="body-nav">
    <div class="background-img">
      <h2 class="fw-bold mb-0">공지사항</h2>
    </div>
    <div class="body-menu">
      <a class="noti" href="#">공지사항</a>
      <a class="noti" href="#">메뉴2</a>
      <a class="noti" href="#">메뉴3</a>
    </div>
  </div>
  <div class="table-body">
    <PostList @select-post="onSelectPost" @write-post="onWritePost" :categoryId="categoryId" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.body-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px;
}

.body-nav .background-img {
  height: 100px;
}

.body-nav .body-menu {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.body-nav a {
  display: flex;
  width: 100%;
  height: 60px;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: black;
  border: 1px solid gray;
}
</style>
