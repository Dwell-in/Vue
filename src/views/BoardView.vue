<script setup>
import { onMounted, ref, watch } from 'vue'
import BoardList from '@/components/board/BoardList.vue'
import api from '@/lib/api'
import BaseBoardView from './BaseBoardView.vue'
import { useRoute } from 'vue-router'

const postList = ref([])
const getPostList = async (categoryId) => {
  try {
    const res = await api.get(`/api/v1/board/post-list?categoryId=${categoryId}&page=1&size=30`)
    postList.value = res.data.data.data
  } catch (e) {
    console.error(e)
  }
}

const search = (keyword) => {
  console.log(keyword)
}

onMounted(() => {
  getPostList(route.params.categoryId)
})

const route = useRoute()
watch(
  () => route.params.categoryId,
  () => {
    getPostList(route.params.categoryId)
  },
)
</script>

<template>
  <BaseBoardView>
    <BoardList :boards="postList" @search="search"></BoardList>
  </BaseBoardView>
</template>

<style scoped></style>
