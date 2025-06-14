<script setup>
import ApartmentSearchPopup from '@/components/house/ApartmentSearchPopup.vue'
import { ref } from 'vue'
import api from '@/lib/api'
import { useLoginUserStore } from '@/stores/loginUser'
import { mapImgOn } from '@/lib/kakao'
import fileDefaultImg from '@/assets/img/fileDefault.png'

const loginUser = useLoginUserStore()

const showPopup = ref(false)
const selectedApt = ref(null)
const mapBox = ref()
const fileInput = ref()

const handleSelect = (apt) => {
  selectedApt.value = apt
  form.value.aptSeq = apt.aptSeq
  mapImgOn(mapBox.value, apt.lat, apt.lon)
}

const imgFile = ref()
const setImgFile = () => {
  const file = fileInput.value.files[0]
  if (!file) {
    imgFile.value = null
    return
  }
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = () => {
    imgFile.value = reader.result
    form.value.img = reader.result
  }
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
  img: null,
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
    const formData = new FormData()

    for (const [key, value] of Object.entries(form.value)) {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v))
      } else if (value !== null && value !== undefined) {
        formData.append(key, value)
      }
    }
    const file = fileInput.value.files[0]
    if (file) {
      formData.append('img', file)
    }

    await api.post('/api/v1/property', formData)

    alert('매물이 등록되었습니다.')
  } catch (e) {
    console.error(e)
    alert('등록 중 오류가 발생했습니다.')
  }
}

const addressSerachCondition = ref('')
</script>

<template>
  <form @submit.prevent="submitProperty" class="form">
    <ApartmentSearchPopup
      v-if="showPopup"
      @selectApt="handleSelect"
      :condition="addressSerachCondition"
      @close="showPopup = false"
    />
    <div class="section">
      <div class="title">매물 정보</div>
      <div class="inputs">
        <div class="form-group addr">
          <label class="label">매물 주소</label>
          <div
            class="block"
            style="flex-shrink: 0; display: flex; flex-direction: column; justify-content: center"
          >
            <div style="margin: 10px 0">주소 검색</div>
            <div class="searchDiv">
              <input type="text" v-model="addressSerachCondition" class="input" />
              <button @click.prevent="showPopup = true" class="search-button">검색</button>
            </div>
            <div class="selected-apt">
              <template v-if="selectedApt">
                {{ selectedApt.sidoName }} {{ selectedApt.gugunName }}
                {{ selectedApt.dongName || '' }}
                {{ selectedApt.jibun }}
                {{ selectedApt.aptNm }}
              </template>
              <br />
              <template v-if="selectedApt">
                (
                {{ selectedApt.roadNm }}
                {{ selectedApt.roadNmBonbun }}
                <template v-if="selectedApt.roadNmBubun && selectedApt.roadNmBubun !== '0'">
                  -{{ selectedApt.roadNmBubun }}
                </template>
                )
              </template>
            </div>
          </div>
          <div class="imgDiv">
            <div v-show="selectedApt" class="mapImgBox" ref="mapBox"></div>
            <div v-if="!selectedApt" class="mapImgBox">
              <i class="fa-solid fa-map-location-dot" style="font-size: 5em"></i>
              <p>주소 선택 시 이곳에 지도가 표시됩니다.</p>
            </div>
            <input
              type="file"
              accept="image/*"
              style="display: none"
              ref="fileInput"
              @change="setImgFile"
            />
            <img :src="imgFile || fileDefaultImg" alt="" @click="fileInput.click" />
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
          rows="10"
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

.selected-apt {
  margin: 10px 0;
  padding: 10px;
  background-color: #fcfcfc;
  border: 1px solid #f5f5f5;
  border-radius: 5px;
}

.form-group.addr {
  height: 300px;

  & > label {
    display: flex;
    align-items: center;
  }

  & > div {
    & * {
      height: auto !important;
    }
  }
  & .searchDiv {
    display: flex;
    gap: 20px;

    & button {
      white-space: nowrap;
      color: white;
      padding: 10px 20px;
      border-radius: 3px;
      border: none;
      background-color: #222222;

      &:hover {
        background-color: #434343;
      }
    }
  }

  & .imgDiv {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;

    & .mapImgBox,
    & img {
      width: 100%;
      height: 100% !important;
      border-radius: 10px;
      background-color: #fcfcfc;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
    }
    & img {
      width: auto !important;
      cursor: pointer;
    }
  }
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

    & *:not(.fa-solid) {
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

    & input,
    & textarea {
      border: 1px solid #ebebeb;
    }

    & input[type='number'] {
      padding: 10px;
    }

    & input[type='text'],
    & textarea {
      width: 100%;
      padding: 10px;
      resize: none;
    }
    & textarea {
      height: 200px;
    }

    & > * + * {
      margin-left: 10px;
    }
  }
  & .form-group + .form-group {
    border-top: none;
  }
}
.form-group:has(textarea) {
  height: 200px !important;
}

.submit-button {
  background-color: #326cf9;
  color: white;
  padding: 20px 40px;
  margin: 20px auto;
  display: block;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
