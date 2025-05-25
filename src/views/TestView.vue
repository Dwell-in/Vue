<template>
  <div class="bg-gray-900 min-h-screen text-white p-6">
    <div class="slider-wrapper">
      <!-- Swiper 형태의 카테고리 선택 -->
      <Swiper
        :modules="[Mousewheel]"
        :slides-per-view="3"
        centeredSlides
        grabCursor
        :mousewheel="true"
        class="category-swiper"
      >
        <SwiperSlide
          v-for="(label, code) in typeMap"
          :key="code"
          @click="selectType(code)"
          :class="['category-slide', { active: selectedType === code }]"
        >
          {{ label }}
        </SwiperSlide>
      </Swiper>

      <!-- 관광지 카드 슬라이더 -->
      <Swiper
        :modules="[EffectCoverflow, Mousewheel]"
        effect="coverflow"
        grabCursor
        centeredSlides
        :slides-per-view="2"
        :mousewheel="true"
        :coverflowEffect="{
          rotate: 10,
          stretch: 3,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }"
        class="attraction-swiper"
      >
        <SwiperSlide v-for="(item, index) in responseData" :key="index" class="card-slide">
          <div class="card">
            <div class="image-wrapper">
              <img :src="item.imgSrc || defaultImg" alt="attraction image" class="card-img" />
            </div>
            <div class="info">
              <h3 class="title">{{ item.title }}</h3>
              <p class="addr">{{ item.addr1 }}</p>
              <p class="desc">{{ item.content }}</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/lib/api'
import defaultImg from '@/assets/img/default_profile.png'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCoverflow, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'

const responseData = ref([])
const selectedType = ref(39)

const typeMap = {
  12: '관광지',
  14: '문화시설',
  15: '축제공연행사',
  25: '여행코스',
  28: '레포츠',
  32: '숙박',
  38: '쇼핑',
  39: '식당',
}

const fetchAttractions = async () => {
  try {
    const res = await api.post('/api/v1/attraction/attraction-list', {
      aptSeq: '11110-100',
      type: selectedType.value,
    })
    responseData.value = res.data.data.data
  } catch (error) {
    console.error('API 호출 실패:', error.response?.data || error.message)
  }
}

const selectType = (code) => {
  selectedType.value = code
  fetchAttractions()
}

fetchAttractions()
</script>

<style scoped>
.slider-wrapper {
  background-color: #1f2937;
  border-radius: 16px;
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

/* 카테고리 swiper */
.category-swiper {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
}

/* 카테고리 슬라이드 공통 */
.category-slide {
  text-align: center;
  padding: 0.75rem 1.2rem;
  border-radius: 9999px;
  background-color: #374151;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: auto;
}

/* 활성된 타입 (selectedType 기준) */
.category-slide.active {
  background-color: white;
  color: #111827;
  font-weight: 700;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

/* 중앙 슬라이드 Swiper가 자동 부여 */
.swiper-slide.swiper-slide-active.category-slide {
  transform: scale(1.2);
  z-index: 10;
}

/* 양옆 슬라이드 흐리게 처리 */
.swiper-slide.category-slide:not(.swiper-slide-active) {
  filter: blur(1px);
  opacity: 0.2;
}

.attraction-swiper {
  width: 100%;
  padding-top: 40px;
  padding-bottom: 40px;
}

.card-slide {
  width: 240px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.image-wrapper {
  height: 160px;
  background-color: #eee;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.info {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-weight: bold;
  color: #d63384;
  font-size: 16px;
  margin-bottom: 4px;
}

.addr,
.desc {
  font-size: 12px;
  color: #444;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
