<script setup>
import { onMounted, ref } from 'vue'
import BaseBoardView from './BaseBoardView.vue'
import api from '@/lib/api'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const board = ref()
const getBoard = async () => {
  try {
    const res = await api.get(`/api/v1/board/board-detail/${route.params.boardId}`)
    return res.data.data.board
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  board.value = await getBoard()
})
</script>

<template>
  <BaseBoardView>
    <div class="detail-header">
      <div class="title">{{ board?.title }}</div>
      <div class="userId">{{ board?.userName }}</div>
      <div class="regTime">{{ board?.regTime }}</div>
    </div>
    <div class="detail-main">
      {{ board?.content }}
      <img v-if="board?.content == ''" src="@/assets/img/detail_temp.png" alt="" />
    </div>
    <div class="detail-footer">
      <button @click="router.back">목록</button>
    </div>
  </BaseBoardView>
</template>

<style scoped>
.detail-header {
  width: 100%;
  height: 100px;
  border-top: 1px solid #24282b;
  margin: 40px 0 0;
  padding: 20px;
  position: relative;
}
.userId {
  color: #777f88;
  font-size: 0.8em;
  position: absolute;
  bottom: 20px;
}
.regTime {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.8em;
  margin: 20px;
  color: #777f88;
}
.detail-main {
  width: 100%;
  border-top: 1px solid #e3e7eb;
  border-bottom: 1px solid #e3e7eb;
  padding: 20px;
}
button {
  margin: 40px 0;
  background: #3c90e2;
  color: #fff;
  border: none;
  padding: 15px 40px;
  cursor: pointer;
  font-size: 0.9em;
}
</style>
