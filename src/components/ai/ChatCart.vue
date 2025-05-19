<template>
  <div class="chat-card">
    <h4>{{ apt.aptNm }}</h4>
    <p>{{ apt.roadNm }} {{ apt.roadNmBonbun }}</p>
    <p>{{ apt.buildYear }}년 준공</p>
  </div>
</template>

<script setup>
defineProps({ apt: Object })
</script>

<style scoped>
.chat-card {
  border: 1px solid #999;
  background: white;
  padding: 10px;
  border-radius: 10px;
  color: black;
  max-width: 250px;
}
</style>
