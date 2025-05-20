<template>
  <main class="card-container">
    <div class="card-list">
      <StarredCard v-for="apt in postList" :key="apt.aptSeq" :apt="apt" @remove="removeFromList" />
    </div>

    <div class="chatbot-wrapper">
      <AiChatbot />
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import StarredCard from '@/components/starred/StarredCard.vue'
import AiChatbot from '@/components/ai/ChatbotAi.vue'

const postList = ref([])

const fetchStarredList = async () => {
  try {
    const res = await api.get('/api/v1/starred')
    postList.value = res.data.data.data
  } catch (e) {
    console.error(e)
  }
}

const removeFromList = (aptSeq) => {
  postList.value = postList.value.filter((apt) => apt.aptSeq !== aptSeq)
}

onMounted(fetchStarredList)
</script>

<style scoped>
.card-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 관심 목록 영역 */
.card-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  flex: 2;
}

/* 챗봇 영역 */
.chatbot-wrapper {
  flex: 1;
  background-color: #1e1e1e;
  border-radius: 12px;
  height: 600px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  color: white;
  min-width: 300px;
}
</style>
