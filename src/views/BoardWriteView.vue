<script setup>
import { ref } from 'vue'
import BaseBoardView from './BaseBoardView.vue'
import api from '@/lib/api'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const form = ref()
const writeBoard = async () => {
  await api.post(
    '/api/v1/board/board-write',
    {
      title: form.value.title.value,
      content: form.value.content.value,
      categoryId: route.params.categoryId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  router.push(`/board/list/${route.params.categoryId}`)
}
</script>

<template>
  <BaseBoardView>
    <form class="write-form" @submit.prevent="writeBoard" ref="form">
      <div class="title">
        <label for="title">제목</label>
        <div class="inputBox">
          <input type="text" id="title" name="title" placeholder="제목을 입력하세요." />
        </div>
      </div>
      <div class="content">
        <label for="content">내용</label>
        <div class="inputBox">
          <textarea name="content" placeholder="내용을 입력하세요."></textarea>
        </div>
      </div>
    </form>
    <div class="write-footer">
      <button class="cancell" @click="router.back">취소</button>
      <input class="submit" type="submit" @click="writeBoard" value="등록" />
    </div>
  </BaseBoardView>
</template>

<style scoped>
.write-form {
  width: 100%;
  border-top: 1px solid #24282b;
  margin-top: 40px;
  font-size: 0.8em;
}
* {
  font-size: 1em;
}
.write-form > div {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #e3e7eb;
}
.write-form > div * {
  padding: 10px;
}
label {
  border-right: 1px solid #e3e7eb;
  display: flex;
  width: 150px;
  align-items: center;
  flex-shrink: 0;
}
.inputBox {
  width: 100%;
}
input:not(.submit),
textarea {
  width: 100%;
  height: 100%;
  border: 1px solid #e3e7eb;
  resize: none;
}
.title {
  height: 70px;
}
.content {
  height: 550px;
}
.write-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.cancell,
.submit {
  margin: 40px 0;
  background: #3c90e2;
  color: #fff;
  border: none;
  padding: 15px 40px;
  cursor: pointer;
  font-size: 0.9em;
}
.cancell {
  background-color: #4f5a66;
}
</style>
