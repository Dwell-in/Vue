<template>
  <main class="card-container">
    <StarredCard v-for="apt in postList" :key="apt.aptSeq" :apt="apt" @remove="removeFromList" />
  </main>
  <div>
    <AiChatbot />
  </div>
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
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin: 50px auto;
}
</style>
