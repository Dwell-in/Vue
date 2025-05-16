<template>
  <main class="card-container">
    <StarredCard v-for="apt in postList" :key="apt.aptSeq" :apt="apt" />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import StarredCard from '@/components/starred/StarredCard.vue'

const postList = ref([])

const fetchStarredList = async () => {
  try {
    const res = await api.get('/api/v1/starred')
    postList.value = res.data.data.data
  } catch (e) {
    console.error(e)
  }
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
