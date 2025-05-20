<template>
  <main class="card-container">
    <div class="card-list">
      <StarredCard v-for="apt in postList" :key="apt.aptSeq" :apt="apt" @remove="removeFromList" />
    </div>
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

.card-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  flex: 2;
}
</style>
