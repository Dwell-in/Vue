<template>
  <div class="apt-card" @dragstart="onDragStart">
    <div class="image-wrapper">
      <img class="apt-image" :src="img" alt="아파트 이미지" @error="(e) => e.target.src = defaultImg"/>
      <div class="overlay-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="15px"
          viewBox="0 -960 960 960"
          width="15px"
          fill="#ffffff"
        >
          <path
            d="M480.08-326.67q72.25 0 122.75-50.58 50.5-50.57 50.5-122.83 0-72.25-50.58-122.75-50.57-50.5-122.83-50.5-72.25 0-122.75 50.58-50.5 50.57-50.5 122.83 0 72.25 50.58 122.75 50.57 50.5 122.83 50.5Zm-.24-62.66q-46.17 0-78.34-32.33-32.17-32.32-32.17-78.5 0-46.17 32.33-78.34 32.32-32.17 78.5-32.17 46.17 0 78.34 32.33 32.17 32.32 32.17 78.5 0 46.17-32.33 78.34-32.32 32.17-78.5 32.17ZM480-200q-146 0-264.67-82.5Q96.67-365 40-500q56.67-135 175.33-217.5Q334-800 480-800t264.67 82.5Q863.33-635 920-500q-56.67 135-175.33 217.5Q626-200 480-200Zm0-300Zm-.11 233.33q118.44 0 217.61-63.5 99.17-63.5 151.17-169.83-52-106.33-151.06-169.83-99.05-63.5-217.5-63.5-118.44 0-217.61 63.5-99.17 63.5-151.83 169.83 52.66 106.33 151.72 169.83 99.05 63.5 217.5 63.5Z"
          />
        </svg>
        <span>{{ apt.viewCount }}</span>
      </div>
    </div>
    <div class="apt-meta">
      <div class="apt-title-row">
        <div>
          <p class="apt-label">{{ apt.sidoName }} {{ apt.gugunName }}</p>
          <h3>{{ apt.aptNm }}</h3>
        </div>
        <StarredToggle :apt="apt"></StarredToggle>
      </div>
      <div class="apt-desc">
        <div>{{ apt.roadNm }} {{ apt.roadNmBonbun }}</div>
        <div>{{ apt.buildYear }}년 준공</div>
      </div>
      <button class="arrow-button" @click="selectApt(apt.aptSeq)">➜</button>
    </div>
  </div>
</template>

<script setup>
const { apt } = defineProps({
  apt: Object,
})
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import StarredToggle from '../starred/StarredToggle.vue'
import defaultImg from '@/assets/img/loginbg.png'
const img = ref({})

const fetchSearchHouseImg = async () => {
  const query = `${apt.aptNm} 아파트`
  const res = await api.get(`/api/v1/search/naver/image`, {
    params: {
      query,
      display: 1,
    },
  })
  if (res.data.items == null) {
    img.value = null
  }
  img.value = res.data.items[0]?.link
}

const onDragStart = (event) => {
  const dragData = {
    ...apt,
    imgSrc: img.value || null,
  }
  event.dataTransfer.setData('application/json', JSON.stringify(dragData))
}

onMounted(() => {
  fetchSearchHouseImg()
})

import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const selectApt = (aptSeq) => {
  modalStore.setAptSeq(aptSeq)
}
</script>

<style lang="scss" scoped>
.apt-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.apt-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.heart-img:hover {
  transform: scale(1.1);
}

.star-toggle {
  display: flex;
  justify-content: flex-end;
  padding: 8px 12px 0 0;
}

.image-wrapper {
  position: relative;
  height: 60%;
  flex-shrink: 0;
}

.apt-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: block;
  object-fit: cover;
}

.overlay-icon {
  position: absolute;
  top: 10px;
  right: 12px;
  background-color: rgba(0, 123, 255, 0.8); /* 반투명 블랙 배경 */
  color: #fff;
  border-radius: 20px;
  padding: 3px 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  transition: background-color 0.2s ease;
}
.overlay-icon span {
  font-size: 14px;
}

.overlay-icon svg {
  fill: #ffffff;
}

.apt-card {
  width: 300px;
  border-radius: 20px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;

  & img{
    cursor: grab;
  }
}

.apt-meta {
  padding: 20px;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.apt-label {
  font-size: 12px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 8px;
}

.apt-desc > * {
  font-size: 14px;
  color: #444;
  line-height: 1.4em;
}

.arrow-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #eee;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 16px;
  cursor: pointer;
}

.arrow-button:hover {
  background-color: #49b4e6;
  color: #fff;
}
</style>
