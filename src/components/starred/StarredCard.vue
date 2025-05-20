<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'

const props = defineProps({
  apt: Object,
  img: String,
  mode: {
    type: String,
    default: 'list',
  },
})

const emit = defineEmits(['remove'])

const isStarred = ref(false)
const img = ref(null)

// 즐겨찾기 확인
const fetchStarredStatus = async () => {
  try {
    const res = await api.get(`/api/v1/house/view/starred/${props.apt.aptSeq}`)
    isStarred.value = res.data.data.isStarred
  } catch (e) {
    console.error('즐겨찾기 조회 실패', e)
  }
}

// 즐겨찾기 토글
const toggleStarred = async () => {
  try {
    const url = `/api/v1/starred/${props.apt.aptSeq}`
    if (isStarred.value) {
      const confirmDelete = confirm('정말 관심지역에서 삭제하시겠습니까?')
      if (!confirmDelete) return
      await api.delete(url)
      emit('remove', props.apt.aptSeq)
    } else {
      await api.post(url)
    }
  } catch (e) {
    console.error('즐겨찾기 처리 중 오류:', e)
    alert('에러가 발생했습니다.')
  }
}

// 이미지 검색
const fetchSearchHouseImg = async () => {
  const query = `${props.apt.aptNm} 아파트`
  const res = await api.get(`/api/v1/search/naver/image`, {
    params: { query, display: 1 },
  })
  img.value = res.data.items?.[0]?.link ?? null
}

// 드래그 시작
const onDragStart = (event) => {
  console.log(props.apt)
  if (props.mode === 'chat') return
  const dragData = {
    ...props.apt,
    imgSrc: img.value || null,
  }
  event.dataTransfer.setData('application/json', JSON.stringify(dragData))
}

onMounted(() => {
  if (props.mode === 'list') {
    fetchSearchHouseImg()
    fetchStarredStatus()
  }
})
</script>

<template>
  <div
    class="apt-card"
    :class="{ 'chat-style': mode === 'chat' }"
    :draggable="mode !== 'chat'"
    @dragstart="onDragStart"
  >
    <!-- 이미지: list 모드에서만 -->
    <div v-if="mode === 'list'" class="image-wrapper">
      <img class="apt-image" :src="img" alt="아파트 이미지" />
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

        <svg
          class="heart-toggle"
          @click="toggleStarred"
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          :fill="isStarred ? '#ff69b4' : 'none'"
          stroke="#ff69b4"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 
             7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>
      </div>
      <p class="apt-desc">
        {{ apt.roadNm }} {{ apt.roadNmBonbun }}<br />
        {{ apt.buildYear }}년 준공
      </p>
      <button v-if="mode === 'list'" class="arrow-button">➜</button>
    </div>
  </div>
</template>

<style scoped>
.apt-title-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.apt-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.heart-img {
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.heart-toggle {
  margin-right: 5px;
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
}

.apt-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: block;
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
}

.apt-card:hover {
  background-color: #0056b3;
  color: #fff;
  transform: translateY(-5px);
}

.apt-meta {
  padding: 20px;
  position: relative;
}

.apt-label {
  font-size: 12px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 8px;
}

.apt-desc {
  font-size: 14px;
  color: #444;
  margin: 10px 0;
  line-height: 1.4;
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
  background: #ddd;
}
.chat-style {
  border: 1px solid #999;
  background: #f2f2f2;
  box-shadow: none;
  max-width: 250px;
  padding: 12px;
  margin: 5px 0;
  font-size: 14px;
}

.chat-style .apt-image,
.chat-style .heart-toggle,
.chat-style .arrow-button,
.chat-style .overlay-icon {
  display: none;
}
</style>
