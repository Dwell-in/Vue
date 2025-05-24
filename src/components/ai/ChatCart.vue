<template>
  <div class="apt-card">
    <button class="delete-button" @click="deleteAptChat">✖</button>
    <div class="apt-meta">
      <img class="apt-image" :src="apt.imgSrc" alt="아파트 이미지" />
      <div class="apt-title-row">
        <!-- <p class="apt-label">{{ apt.sidoName }} {{ apt.gugunName }}</p> -->
        <div class="aptNm">{{ apt.aptNm }}</div>
      </div>
      <!-- <p class="apt-desc">
        {{ apt.roadNm }} {{ apt.roadNmBonbun }}<br />
        {{ apt.buildYear }}년 준공
      </p> -->
    </div>
  </div>
</template>

<script setup>
const prop = defineProps({ apt: Object })
const emit = defineEmits(['remove'])
const deleteAptChat = () => {
  emit('remove', prop.apt.aptSeq)
}
</script>

<style scoped>
.apt-card {
  width: 150px;
  flex-shrink: 0;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background-color: #fff;
  color: black;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
  position: relative;
}

.apt-meta {
  height: 100%;
  padding: 5%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.apt-image {
  width: 100%;
  height: 60%;
  flex-shrink: 0;
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.apt-title-row {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
}

.aptNm{
  font-size: 0.9rem;
}

.apt-label {
  font-size: 0.5rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 4px;
}

.apt-title {
  font-size: 0.8rem;
  font-weight: bold;
  margin: 0;
}

.apt-desc {
  font-size: 0.6rem;
  line-height: 1.4;
}

.delete-button {
  position: absolute;
  background: #2a2a2aa3;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
  color: white;
  top: 2%;
  right: 2%;
  cursor: pointer;
  z-index: 5;
}
</style>
