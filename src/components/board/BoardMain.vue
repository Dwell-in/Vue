<template>
  <div>
    <BoardMenu />
    <BoardToolbar @write-click="onWriteClick" />
    <PostList @select-post="onSelectPost" @edit-post="onEditPost" />
  </div>
</template>

<script setup>
import BoardMenu from '@/components/board/BoardMenu.vue'
import BoardToolbar from '@/components/board/BoardToolbar.vue'
import PostList from '@/components/board/PostList.vue'

const emit = defineEmits(['view-detail', 'write-post', 'edit-post'])

const onWriteClick = () => {
  emit('write-post')
}

const onSelectPost = (id) => {
  emit('view-detail', id)
}

const onEditPost = (id) => {
  emit('edit-post', id)
}
</script>
