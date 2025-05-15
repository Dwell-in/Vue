<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import BoardToolbar from '@/components/board/BoardToolbar.vue'

const emit = defineEmits(['select-post', 'edit-post', 'write-post'])

const postList = ref([])

const props = defineProps({
  categoryId: Number,
})

const fetchPostList = async () => {
  try {
    const res = await api.get('/api/v1/board/post-list')
    postList.value = res.data.data.data
  } catch (e) {
    console.error(e)
  }
}

const handleSearch = (keyword) => {
  fetchPostList(keyword)
}

const goDetail = (boardId) => {
  emit('select-post', boardId)
}

onMounted(fetchPostList)
</script>

<template>
  <BoardToolbar @search="handleSearch" @write-click="emit('write-post')" />

  <table class="table table-hover table-striped text-center align-middle">
    <thead class="table-light">
      <tr>
        <th>번호</th>
        <th>제목</th>
        <th>조회수</th>
        <th>작성일</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in postList" :key="item.boardId">
        <td>{{ index + 1 }}</td>
        <td class="text-start ps-4">
          <a href="#" @click.prevent="goDetail(item.boardId)">
            {{ item.title }}
          </a>
        </td>
        <td>{{ item.viewCount }}</td>
        <td>{{ item.regTime }}</td>
      </tr>
    </tbody>
  </table>
</template>
