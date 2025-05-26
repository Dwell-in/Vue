<template>
  <NavBase :titles="['사용자 정보 등록']" />
  <main class="form-container">
    <form @submit.prevent="submitPreferences" class="dark-form">
      <h2>내 집 찾기 선호 정보</h2>

      <!-- 희망 지역 -->
      <label>희망 지역</label>
      <input v-model="form.preferredLocation" placeholder="예: 강남구, 송파구" />

      <!-- 매매가 -->
      <label>매매가</label>
      <p>{{ formatPrice(form.budgetRange[0]) }} ~ {{ formatPrice(form.budgetRange[1]) }} 원</p>
      <Slider
        v-model="form.budgetRange"
        :min="50000000"
        :max="3000000000"
        :step="10000000"
        :showTooltip="'focus'"
      />

      <!-- 월세 -->
      <label>월세</label>
      <p>{{ formatPrice(form.rentRange[0]) }} ~ {{ formatPrice(form.rentRange[1]) }} 원</p>
      <Slider
        v-model="form.rentRange"
        :min="0"
        :max="3000000"
        :step="50000"
        :showTooltip="'focus'"
      />

      <!-- 주택 유형 -->
      <label>주택 유형</label>
      <select v-model="form.preferredType">
        <option disabled value="">선택</option>
        <option>아파트</option>
        <option>오피스텔</option>
        <option>빌라</option>
        <option>단독주택</option>
      </select>

      <!-- 면적 / 방 -->
      <label>최소 면적 (㎡)</label>
      <input type="number" v-model.number="form.spaceRequirements.minArea" />

      <label>최소 방 개수</label>
      <input type="number" v-model.number="form.spaceRequirements.minRooms" />

      <!-- 출퇴근 정보 -->
      <label>출퇴근 목적지</label>
      <input v-model="form.commuteTarget" placeholder="예: 멀티캠퍼스" />

      <label>최대 통근 시간 (분)</label>
      <input type="number" v-model.number="form.commuteTimeLimit" />

      <!-- 가족 구성 -->
      <label>가족 구성</label>
      <select v-model="form.householdType">
        <option disabled value="">선택</option>
        <option>1인 가구</option>
        <option>신혼부부</option>
        <option>어린 자녀 있음</option>
        <option>노부모 동거</option>
      </select>

      <!-- 층수 / 건축 -->
      <label>층수 선호</label>
      <select v-model="form.floorPreference">
        <option disabled value="">선택</option>
        <option>저층</option>
        <option>고층</option>
        <option>무관</option>
      </select>

      <label>건축 연도 선호</label>
      <select v-model="form.buildYearPreference">
        <option disabled value="">선택</option>
        <option>신축</option>
        <option>리모델링</option>
        <option>무관</option>
      </select>

      <!-- 필수 옵션 -->
      <label>필수 옵션</label>
      <div class="option-box">
        <label v-for="option in allFeatures" :key="option" class="tag-option">
          <input type="checkbox" :value="option" v-model="form.requiredFeatures" />
          {{ option }}
        </label>
      </div>

      <!-- 생활 우선순위 -->
      <label>생활 우선순위</label>
      <div class="option-box">
        <label v-for="priority in allPriorities" :key="priority" class="tag-option">
          <input type="checkbox" :value="priority" v-model="form.lifestylePriority" />
          {{ priority }}
        </label>
      </div>

      <button type="submit">등록하기</button>
    </form>
  </main>
</template>

<script setup>
import { reactive } from 'vue'
import api from '@/lib/api'
import NavBase from '@/components/layout/nav/NavBase.vue'
import Slider from '@vueform/slider'

const allFeatures = ['엘리베이터', '주차장', 'CCTV', '반려동물 가능']
const allPriorities = ['교통', '학군', '상권', '조용함', '공원 인접']

const form = reactive({
  preferredLocation: '',
  budgetRange: [1100000000, 1200000000],
  rentRange: [0, 1000000],
  preferredType: '',
  spaceRequirements: { minArea: 0, minRooms: 0 },
  commuteTarget: '',
  commuteTimeLimit: 0,
  householdType: '',
  floorPreference: '',
  buildYearPreference: '',
  requiredFeatures: [],
  lifestylePriority: [],
})

const formatPrice = (val) => val.toLocaleString()

const submitPreferences = async () => {
  try {
    const rawForm = JSON.parse(JSON.stringify(form))
    console.log(rawForm)
    await api.post('/api/v1/memberFavorite', rawForm)
    alert('선호 정보가 등록되었습니다.')
  } catch (error) {
    console.log(error)
    alert('오류가 발생했습니다.')
  }
}
</script>

<style>
:root {
  --slider-connect-bg: #49b4e6;
  --slider-tooltip-bg: #49b4e699;
  --slider-handle-ring-color: #49b4e6;
  --slider-handle-bg: #fff;
}
</style>

<style scoped>
@import '@vueform/slider/themes/default.css';

.form-container {
  background: #111;
  color: #fff;
  padding: 2rem;
  max-width: 460px;
  margin: 80px auto;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
}
.dark-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
input,
select {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background-color: #222;
  color: #fff;
}
input::placeholder {
  color: #888;
}
.option-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.tag-option {
  background: #222;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
}
.tag-option input {
  margin-right: 5px;
}
button {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px;
  font-weight: bold;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
