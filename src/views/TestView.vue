<template>
  <div class="bg-gray-900 min-h-screen text-white p-6">
    <button
      @click="testAttractionAPI"
      class="mb-4 px-4 py-2 bg-pink-500 rounded hover:bg-pink-600 transition"
    >
      Attraction API 호출
    </button>

    <Swiper
      :slides-per-view="1.2"
      :space-between="16"
      :breakpoints="{
        640: { slidesPerView: 2.2 },
        768: { slidesPerView: 3.2 },
        1024: { slidesPerView: 4.2 },
      }"
      class="w-full"
    >
      <SwiperSlide
        v-for="(item, index) in responseData"
        :key="index"
        class="card bg-white text-black rounded-xl overflow-hidden shadow-md flex flex-col"
      >
        <!-- 고정된 이미지 영역 -->
        <div class="image-wrapper">
          <img :src="item.imgSrc || defaultImg" alt="attractionImg" class="card-img" />
        </div>

        <!-- 정보 영역 -->
        <div class="flex-1 p-3 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold truncate text-pink-600">{{ item.title }}</h3>
            <p class="text-xs text-gray-700 truncate">{{ item.addr1 }}</p>
            <p class="text-xs text-gray-500 truncate">{{ item.content }}</p>
          </div>
          <a
            v-if="item.homePage"
            :href="item.homePage"
            target="_blank"
            class="mt-2 text-blue-500 text-xs hover:underline"
          >
            홈페이지
          </a>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/lib/api'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import defaultImg from '@/assets/img/default_profile.png'

const responseData = ref([])

const testAttractionAPI = async () => {
  try {
    const res = await api.post('/api/v1/attraction/attraction-list', {
      aptSeq: '11110-100',
      type: 39,
    })
    responseData.value = res.data.data.data
    console.log('API 응답:', res.data)
  } catch (error) {
    console.error('API 호출 실패:', error.response?.data || error.message)
  }
}
</script>

<style scoped>
.card {
  width: 240px;
  height: 320px;
  display: flex;
  flex-direction: column;
}

.image-wrapper {
  width: 100%;
  height: 160px;
  overflow: hidden;
  position: relative;
  background-color: #eee;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
</style>
