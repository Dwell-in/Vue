<script setup>
import ApartmentSearchPopup from '@/components/house/ApartmentSearchPopup.vue'
import { ref } from 'vue'
import api from '@/lib/api'
import { useLoginUserStore } from '@/stores/loginUser'

const loginUser = useLoginUserStore()

const showPopup = ref(false)
const selectedApt = ref(null)

const handleSelect = (apt) => {
  selectedApt.value = apt
  form.value.aptSeq = apt.aptSeq
}

const form = ref({
  aptSeq: '',
  title: '',
  type: '매매',
  netArea: null,
  supplyArea: null,
  floor: null,
  totalFloor: null,
  rooms: null,
  bathrooms: null,
  direction: '',
  elevator: false,
  parkingAvailable: false,
  immediateMoveIn: false,
  structureType: '',
  description: '',
  salePrice: null,
  deposit: null,
  monthlyRent: null,
  managementFee: null,
  optionIds: [],
  safetyIds: [],
  memberId: loginUser.id,
})

const options = [
  { id: 1, name: '붙박이장' },
  { id: 2, name: '천장형 에어컨' },
  { id: 3, name: '식탁' },
  { id: 4, name: '세탁기' },
  { id: 5, name: '냉장고' },
  { id: 6, name: '전자레인지' },
  { id: 7, name: 'TV' },
  { id: 8, name: '가스레인지' },
  { id: 9, name: '인덕션' },
  { id: 10, name: '신발장' },
]

const safeties = [
  { id: 1, name: '비디오폰' },
  { id: 2, name: '인터폰' },
  { id: 3, name: 'CCTV' },
  { id: 4, name: '현관 보안' },
  { id: 5, name: '경비실' },
  { id: 6, name: '카드키' },
  { id: 7, name: '무인택배함' },
]

const submitProperty = async () => {
  try {
    await api.post('/api/v1/property', { ...form.value })
    alert('매물이 등록되었습니다.')
  } catch (e) {
    console.error(e)
    alert('등록 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <form @submit.prevent="submitProperty" class="form">
    <button @click.prevent="showPopup = true">아파트 검색</button>
    <ApartmentSearchPopup v-if="showPopup" @selectApt="handleSelect" @close="showPopup = false" />

    <div v-if="selectedApt" class="selected-apt">
      {{ selectedApt.sidoName }} {{ selectedApt.gugunName }} {{ selectedApt.dongName || '' }}
      {{ selectedApt.jibun }}
      {{ selectedApt.aptNm }}
      <br />
      (
      {{ selectedApt.roadNm }}
      {{ selectedApt.roadNmBonbun }}
      <template v-if="selectedApt.roadNmBubun && selectedApt.roadNmBubun !== '0'">
        -{{ selectedApt.roadNmBubun }}
      </template>
      )
    </div>

    <div class="section">
      <div class="title">매물 정보</div>
      <div class="inputs">
        <div class="form-group">
          <label class="label">매물 주소</label>
          <div class="block">
            <div>주소 검색</div>
            <input type="text" v-model.number="form.netArea" class="input" />
          </div>
        </div>
        <div class="form-group">
          <label class="label">전용면적 (㎡)</label>
          <input type="number" step="0.01" v-model.number="form.netArea" class="input" />
        </div>

        <div class="form-group">
          <label class="label">공급면적 (㎡)</label>
          <input type="number" step="0.01" v-model.number="form.supplyArea" class="input" />
        </div>
      </div>

      <div class="form-group">
        <label class="label">방 수</label>
        <input type="number" v-model.number="form.rooms" class="input" />
      </div>
    </div>

    <div class="section">
      <div class="title">거래 정보</div>
      <div class="inputs">
        <div class="form-group">
          <label class="label">거래 유형</label>
          <input type="radio" v-model="form.type" value="매매" /><label for="">매매</label>
          <input type="radio" v-model="form.type" value="전세" /><label for="">전세</label>
          <input type="radio" v-model="form.type" value="월세" /><label for="">월세</label>
        </div>

        <div v-if="form.type === '전세'" class="form-group">
          <label class="label">보증금</label>
          <input type="number" v-model.number="form.deposit" class="input" />
        </div>

        <div v-else-if="form.type === '매매'" class="form-group">
          <label class="label">매매가</label>
          <input type="number" v-model.number="form.salePrice" class="input" />
        </div>

        <div v-else-if="form.type === '월세'" class="form-group">
          <label class="label">월세</label>
          <input type="number" v-model.number="form.monthlyRent" class="input" />
        </div>

        <div class="form-group">
          <label class="label">즉시 입주 가능</label>
          <input type="checkbox" v-model="form.immediateMoveIn" class="checkbox" />
          <label for="">가능</label>
        </div>

        <div class="form-group">
          <label class="label">관리비</label>
          <input type="number" v-model.number="form.managementFee" class="input" />
        </div>
      </div>
    </div>

    <div class="section">
      <div class="title">추가 정보</div>
      <div class="inputs">
        <div class="form-group">
          <label class="label">층수</label>
          <input type="number" v-model.number="form.floor" class="input" />
        </div>

        <div class="form-group">
          <label class="label">건물 전체 층수</label>
          <input type="number" v-model.number="form.totalFloor" class="input" />
        </div>

        <div class="form-group">
          <label class="label">욕실 수</label>
          <input type="number" v-model.number="form.bathrooms" class="input" />
        </div>

        <div class="form-group">
          <label class="label">방향</label>
          <input type="text" v-model="form.direction" class="input" />
        </div>
      </div>

      <div class="form-group">
        <label class="label">엘리베이터</label>
        <input type="checkbox" v-model="form.elevator" class="checkbox" />
        <div>있음</div>
      </div>

      <div class="form-group">
        <label class="label">주차 가능</label>
        <input type="checkbox" v-model="form.parkingAvailable" class="checkbox" />
        <div>가능</div>
      </div>
    </div>

    <div class="section">
      <div class="title">시설 정보</div>
      <div class="inputs">
        <div class="form-group">
          <label class="label">구조</label>
          <input type="text" v-model="form.structureType" class="input" />
        </div>

        <div class="form-group">
          <label class="label">옵션</label>
          <div class="checkbox-group">
            <label v-for="option in options" :key="option.id" class="checkbox-label">
              <input type="checkbox" :value="option.id" v-model="form.optionIds" class="checkbox" />
              {{ option.name }}
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="label">안전시설</label>
          <div class="checkbox-group">
            <label v-for="safety in safeties" :key="safety.id" class="checkbox-label">
              <input type="checkbox" :value="safety.id" v-model="form.safetyIds" class="checkbox" />
              {{ safety.name }}
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="title">사진 등록</div>
      <div class="inputs"></div>
    </div>

    <div class="section">
      <div class="title">상세 정보</div>
      <div class="inputs">
        <div class="form-group">
          <label class="label">제목</label>
          <input
            type="text"
            v-model="form.title"
            class="input"
            placeholder="리스트에 노출되는 문구입니다. 40자 이내로 작성해 주세요."
          />
        </div>
      </div>

      <div class="form-group">
        <label class="label">설명</label>
        <textarea
          v-model="form.description"
          class="input"
          placeholder="매물 상세 페이지에 노출되는 문구입니다. 1000자 이내로 작성해주세요."
        ></textarea>
      </div>
    </div>

    <button type="submit" class="submit-button">등록</button>
  </form>
</template>

<style lang="scss" scoped>
form {
  width: 100%;
}
.section {
  width: 100%;
  padding: 20px 0;

  & .title {
    width: 100%;
    line-height: 3em;
    border-bottom: 2px solid black;
  }

  & .form-group {
    display: flex;
    align-items: center;
    border: 1px solid #f5f5f5;

    & * {
      height: 100%;
      font-size: 0.7rem;
    }
    & > *:first-child {
      padding: 20px;
      line-height: 3em;
      width: 15%;
      flex-shrink: 0;
      background-color: #fcfcfc;
    }
    & > *:not(:first-child):not(.block) {
      display: flex;
      align-items: center;
      white-space: nowrap;
      gap: 10px;
    }

    & input[type='number'] {
      padding: 20px 10px;
    }

    & input[type='text'],
    & textarea {
      width: 100%;
      padding: 20px 10px;
      resize: none;
    }
    & textarea {
      height: 200px;
    }

    & > * + * {
      margin-left: 10px;
    }
  }
}
</style>
