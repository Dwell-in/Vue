<script setup>
import { onMounted, ref, watch } from 'vue'
import BoardList from '@/components/board/BoardList.vue'
import api from '@/lib/api'
import BaseBoardView from './BaseBoardView.vue'
import { useRoute } from 'vue-router'

const currentView = ref(1)
const selectView = (categoryId) => {
  currentView.value = categoryId
  getPostList(categoryId)
}

const postList = ref([])
const getPostList = async (categoryId) => {
  try {
    const res = await api.get(`/api/v1/board/post-list?categoryId=${categoryId}`)
    postList.value = res.data.data.data
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  getPostList(1)
})

const search = (keyword) => {
  console.log(keyword)
}

const route = useRoute()

watch(
  () => route.query.page,
  (newPage) => {
    // page 쿼리 파라미터가 바뀌면 실행
    console.log('페이지 바뀜:', newPage)
  },
)
</script>

<template>
  <BaseBoardView>
    <main>
      <BoardList :boards="postList" @search="search"></BoardList>
    </main>
  </BaseBoardView>
</template>

<style scoped>
main {
  max-width: 1200px;
  margin: 20px auto 0;
  min-height: calc(100vh - 65px - 210px - 150px);
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
