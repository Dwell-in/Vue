<script setup>
import '@vueform/slider/themes/default.css'
import Slider from '@vueform/slider'
import { onMounted, ref } from 'vue'

const props = defineProps({
  filterRange: Object,
})

const selectedType = ref()
const selectedArea = ref([])
const selectedOption = ref([])
const salePriceRange = ref([0, 1])
const depositRange = ref([0, 1])
const monthlyRentRange = ref([0, 1])
const roomRange = ref([0, 1])
const floorRange = ref([0, 1])

const options = [
  '붙박이장',
  '천장형 에어컨',
  '식탁',
  '세탁기',
  '냉장고',
  '전자레인지',
  'TV',
  '가스레인지',
  '인터폰',
  '신발장',
  '비디오폰',
  'CCTV',
  '현관 보안',
  '경비실',
  '카드키',
  '무인택배함',
]

// 거래 타입 선택
const selectType = (type) => {
  if (type == '매매' && !props.filterRange.salePrice.at(-1)) return
  if (type == '전세' && !props.filterRange.deposit.at(-1)) return
  selectedType.value = type
}

// 면적 선택
const selectArea = (area) => {
  if (selectedArea.value.includes(area)) {
    selectedArea.value.splice(selectedArea.value.indexOf(area), 1)
  } else {
    selectedArea.value.push(area)
  }
}

// 추가 옵션 선택
const selectOption = (option) => {
  if (selectedOption.value.includes(option)) {
    selectedOption.value.splice(selectedOption.value.indexOf(option), 1)
  } else {
    selectedOption.value.push(option)
  }
}

// 필터링 전달
const emit = defineEmits(['filtering'])
const filtering = () => {
  const filteredOption = {
    type: selectedType.value,
    area: selectedArea.value,
    selectedOption: selectedOption.value,
    range:
      selectedType.value == '매매'
        ? salePriceRange
        : selectedType.value == '전세'
          ? depositRange.value
          : monthlyRentRange.value,
    room: roomRange.value,
    floor: floorRange.value,
  }
  emit('filtering', filteredOption)
}

// 숫자 포맷팅
const formatToEokMan = (v) =>
  `${Math.floor(v / 100000000)}억 ${Math.floor((v % 100000000) / 10000)}만원`
    .replace(/^0억 /, '')
    .replace(/ 0만원$/, '')

onMounted(() => {
  roomRange.value = [props.filterRange.room.at(0), props.filterRange.room.at(-1)]
  floorRange.value = [props.filterRange.floor.at(0), props.filterRange.floor.at(-1)]
  salePriceRange.value = [
    Math.floor(props.filterRange.salePrice.at(0) / 100000000) * 100000000,
    Math.ceil(props.filterRange.salePrice.at(-1) / 100000000) * 100000000,
  ]
  depositRange.value = [
    Math.floor(props.filterRange.deposit.at(0) / 10000000) * 10000000,
    Math.ceil(props.filterRange.deposit.at(-1) / 10000000) * 10000000,
  ]
  monthlyRentRange.value = [
    Math.floor(props.filterRange.monthlyRent.at(0) / 100000) * 100000,
    Math.ceil(props.filterRange.monthlyRent.at(-1) / 100000) * 100000,
  ]
  selectedType.value = props.filterRange.salePrice.at(-1)
    ? '매매'
    : props.filterRange.deposit.at(-1)
      ? '전세'
      : '월세'
  selectedArea.value = [...props.filterRange.area]
})
</script>

<template>
  <div class="filter">
    <div class="title" style="padding-bottom: 0">
      <i class="fa-solid fa-gear" style="font-size: 1em"></i>&ensp;Filter
      <i
        class="fa-solid fa-rotate-right fa-rotate-180"
        @click="filtering"
        style="position: absolute; top: 2vh; right: 2vh; cursor: pointer"
      ></i>
    </div>
    <div class="filterForm">
      <div class="wrap type">
        <div class="title" @click="selectType('매매')">
          <i
            class="fa-regular"
            :class="selectedType == '매매' ? 'fa-square-check' : 'fa-square'"
          ></i>
          <div>매매</div>
        </div>
        <div class="title" @click="selectType('전세')">
          <i
            class="fa-regular"
            :class="selectedType == '전세' ? 'fa-square-check' : 'fa-square'"
          ></i>
          <div>전세</div>
        </div>
        <div class="title" @click="selectType('월세')">
          <i
            class="fa-regular"
            :class="selectedType == '월세' ? 'fa-square-check' : 'fa-square'"
          ></i>
          <div>월세</div>
        </div>
      </div>
      <!-- /.wrap type -->
      <div v-if="selectedType == '매매'" class="wrap price slider-container">
        <div class="header">
          <div class="title">매매가</div>
          <span class="rangeText"
            >{{ formatToEokMan(salePriceRange[0]) }} ~ {{ formatToEokMan(salePriceRange[1]) }}</span
          >
        </div>
        <Slider
          v-model="salePriceRange"
          :min="Math.floor(props.filterRange.salePrice.at(0) / 100000000) * 100000000"
          :max="Math.ceil(props.filterRange.salePrice.at(-1) / 100000000) * 100000000"
          :step="100000000"
          :showTooltip="'focus'"
        />
        <div class="range" style="line-height: 3em">
          <div>
            {{
              formatToEokMan(Math.floor(props.filterRange.salePrice.at(0) / 100000000) * 100000000)
            }}
          </div>
          <div>
            {{
              formatToEokMan(Math.ceil(props.filterRange.salePrice.at(-1) / 100000000) * 100000000)
            }}
          </div>
        </div>
      </div>
      <!-- /.wrap price -->
      <div v-if="selectedType == '전세'" class="wrap price slider-container">
        <div class="header">
          <div class="title">보증금</div>
          <span class="rangeText"
            >{{ formatToEokMan(depositRange[0]) }} ~ {{ formatToEokMan(depositRange[1]) }}</span
          >
        </div>
        <Slider
          v-model="depositRange"
          :min="Math.floor(props.filterRange.deposit.at(0) / 10000000) * 10000000"
          :max="Math.ceil(props.filterRange.deposit.at(-1) / 10000000) * 10000000"
          :step="10000000"
          :showTooltip="'focus'"
        />
        <div class="range" style="line-height: 3em">
          <div>
            {{ formatToEokMan(Math.floor(props.filterRange.deposit.at(0) / 10000000) * 10000000) }}
          </div>
          <div>
            {{ formatToEokMan(Math.ceil(props.filterRange.deposit.at(-1) / 10000000) * 10000000) }}
          </div>
        </div>
      </div>
      <!-- /.wrap price -->
      <div v-else class="wrap price slider-container">
        <div class="header">
          <div class="title">월세</div>
          <span class="rangeText"
            >{{ formatToEokMan(monthlyRentRange[0]) }} ~
            {{ formatToEokMan(monthlyRentRange[1]) }}</span
          >
        </div>
        <Slider
          v-model="monthlyRentRange"
          :min="Math.floor(props.filterRange.monthlyRent.at(0) / 100000) * 100000"
          :max="Math.ceil(props.filterRange.monthlyRent.at(-1) / 100000) * 100000"
          :step="100000"
          :showTooltip="'focus'"
        />
        <div class="range" style="line-height: 3em">
          <div>
            {{ formatToEokMan(Math.floor(props.filterRange.monthlyRent.at(0) / 100000) * 100000) }}
          </div>
          <div>
            {{ formatToEokMan(Math.ceil(props.filterRange.monthlyRent.at(-1) / 100000) * 100000) }}
          </div>
        </div>
      </div>
      <!-- /.wrap price -->
      <div class="wrap" style="justify-content: start">
        <div class="title">면적</div>
        <div class="exclue">
          <div
            v-for="area in props.filterRange.area"
            :key="area"
            @click="selectArea(area)"
            :class="{ active: selectedArea.includes(area) }"
          >
            {{ area }}
          </div>
        </div>
      </div>
      <!-- /.wrap -->
      <div class="wrap count slider-container">
        <div class="title">방 수</div>
        <div class="slider">
          <Slider
            v-if="props.filterRange.room.length != 0"
            v-model="roomRange"
            :min="props.filterRange.room.at(0)"
            :max="props.filterRange.room.at(-1)"
            :step="1"
            :showTooltip="'focus'"
          />
          <div class="range">
            <template v-for="(a, index) in props.filterRange.room.at(-1)" :key="index">
              <div v-if="index + 1 >= props.filterRange.room.at(0)">
                {{ index + 1 }}
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- /.wrap -->
      <div class="wrap count slider-container">
        <div class="title">층 수</div>
        <div class="slider">
          <Slider
            v-model="floorRange"
            :min="props.filterRange.floor.at(0)"
            :max="props.filterRange.floor.at(-1)"
            :step="1"
            :showTooltip="'focus'"
          />
          <div class="range">
            <div>{{ props.filterRange.floor.at(0) }}</div>
            <div>{{ props.filterRange.floor.at(-1) }}</div>
          </div>
        </div>
      </div>
      <!-- /.wrap -->
      <div class="wrap option">
        <div class="title">옵션</div>
        <div class="options">
          <div
            v-for="option in options"
            :key="option"
            @click="selectOption(option)"
            :class="{ active: selectedOption.includes(option) }"
          >
            {{ option }}
          </div>
        </div>
      </div>
      <!-- /.wrap -->
    </div>
    <!-- /.filterForm -->
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  display: flex;
  justify-content: space-between;

  & + .wrap {
    margin-top: -1vh;
  }

  & .title {
    width: 20%;
    flex-shrink: 0;
  }
}
.price .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  padding: 2vh 0;
  font-size: 1.5em;
  & *:not(span) {
    font-size: 1em;
  }
}
.active {
  background-color: #3b3b3b;
  border-radius: 10px;
  padding: 5px 10px;
}
.slider-container {
  flex-direction: column;
  justify-content: space-between;

  & .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  & .rangeText {
    text-align: end;
  }
  & .slider-target {
    width: 100%;
    padding: 0 10px;
  }
  & :deep(.slider-tooltip) {
    background-color: #49b4e6;
  }
  & :deep(.slider-connect) {
    background-color: #49b4e6;
  }
  & .range {
    display: flex;
    justify-content: space-between;
    line-height: 2em;
  }
}
.type {
  justify-content: start;
  gap: 30px;

  & > div {
    display: flex;
    align-items: center;
    gap: 20px;

    & i {
      cursor: pointer;
    }
  }
}
.count {
  flex-direction: row;
  align-items: center;
  justify-content: start;
  height: calc(4vh + 40px);

  & .slider {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
  }

  & .range {
    margin-top: 5px;
  }
}
.exclue {
  display: flex;
  align-items: center;
  gap: 10px;
  & > div {
    cursor: pointer;
  }
}
.wrap.option {
  flex-direction: column;

  & .options {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    & > div {
      cursor: pointer;
    }
  }
}
</style>
