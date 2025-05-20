<template>
  <div class="apt-card">
    <div class="apt-meta">
      <img class="apt-image" :src="apt.imgSrc" alt="아파트 이미지" />
      <div class="apt-title-row">
        <div>
          <p class="apt-label">{{ apt.sidoName }} {{ apt.gugunName }}</p>
          <h3>{{ apt.aptNm }}</h3>
        </div>
      </div>
      <p class="apt-desc">
        {{ apt.roadNm }} {{ apt.roadNmBonbun }}<br />
        {{ apt.buildYear }}년 준공
      </p>
      <button class="delte-button">x</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ apt: Object })
</script>

<style scoped>
.apt-card {
  width: 150px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #fff;
  color: black;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.apt-meta {
  padding: 14px;
  position: relative;
}

.apt-image {
  width: 100%;
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.apt-title-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.apt-label {
  font-size: 11px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 4px;
}

.apt-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.apt-desc {
  font-size: 13px;
  line-height: 1.4;
}

.delte-button {
  background: transparent;
  border: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
