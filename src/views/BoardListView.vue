<script setup>
import { onMounted, ref, watch } from 'vue'
import BoardList from '@/components/board/BoardList.vue'
import api from '@/lib/api'
import BaseBoardView from './BaseBoardView.vue'
import { useRoute } from 'vue-router'

const postList = ref([])
const pageInfo = ref({})
const getPostList = async (params = {}) => {
  try {
    const defaultParams = {
      categoryId: route.params.categoryId,
      page: 1,
      size: 10,
    }
    const query = { ...defaultParams, ...params }

    const queryString = new URLSearchParams(query).toString()
    const res = await api.get(`/api/v1/board/post-list?${queryString}`)

    postList.value = res.data.data.data
    pageInfo.value = res.data.data.pageInfo
  } catch (e) {
    console.error(e)
  }
}

const changePage = (newPage) => {
  getPostList({ page: newPage })
}

const search = ({ key, value }) => {
  const params = {
    page: 1,
    [key]: value,
  }
  getPostList(params)
}

onMounted(() => {
  getPostList()
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
    <BoardList :boards="postList" :offset="pageInfo.offset" @search="search"></BoardList>
        <div class="pagination">
      <button
        v-for="n in pageInfo.totalPages"
        :key="n"
        @click="changePage(n)"
        :class="{ active: pageInfo.page === n }"
      >
        {{ n }}
      </button>
    </div>
  </BaseBoardView>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin: 30px 0;
  gap: 8px;
}

.pagination button {
  padding: 8px 12px;
  border: none;
  background-color: #ddd;
  cursor: pointer;
  font-size: 0.9em;
}

.pagination button.active {
  background-color: #3c90e2;
  color: white;
}
</style>
