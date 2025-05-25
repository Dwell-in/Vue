<script setup>
import PropertyFilter from './PropertyFilter.vue'
import PropertyCard from './PropertyCard.vue'
import PropertyDetail from './PropertyDetail.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import api from '@/lib/api'

const props = defineProps({
  info: Object,
  isInfo: Boolean
})

// 매물 목록
const propertys = ref()
// 필터링된 매물 목록
const filteredPropertys = ref()
// 필터링할 범위
const filterRange = reactive({
  type: null,
  area: [],
  room: [],
  floor: [],
  salePrice: [],
  deposit: [],
  monthlyRent: [],
})
// 필터링된 옵션
const filteredOption = reactive({
  type: null,
  area: null,
  selectedOption: [],
  range: null,
  room: null,
  floor: null,
})

// 매물 목록 가져오기
const getPropertys = async () =>{
  const res = await api.get(`/api/v1/property?aptSeq=${props.info.aptSeq}`)
  propertys.value = res.data.data.data
}

// 필터링할 범위 초기화
const getRange = async () => {
  const keys = [
    ["supplyArea", "area"],
    ["rooms", "room"],
    ["floor", "floor"],
    ["salePrice", "salePrice"],
    ["deposit", "deposit"],
    ["monthlyRent", "monthlyRent"],
  ];

  propertys.value.forEach(p => {
    keys.forEach(([propKey, rangeKey]) => {
      p[propKey] != null && !filterRange[rangeKey].includes(p[propKey]) && filterRange[rangeKey].push(p[propKey]);
    });
  });

  keys.forEach(([, rangeKey]) => {
    filterRange[rangeKey].sort((a, b) => Number(a) - Number(b));
  });
}

// 필터링
const filtering = (result) => {
  Object.assign(filteredOption, result)

  filteredPropertys.value = propertys.value.filter((p) => {
    // 1. type이 정확히 일치
    if (filteredOption.type && p.type != filteredOption.type) return false;

    // 2. area: supplyArea가 area 배열에 포함되어야 함
    if (filteredOption.area && Array.isArray(filteredOption.area)) {
      if (!filteredOption.area.includes(p.supplyArea)) return false;
    }

    // 3. selectedOption: 모두 optionNames 또는 safetyNames에 포함되어야 함
    if (filteredOption.selectedOption && filteredOption.selectedOption.length > 0) {
      const combinedOptions = [...(p.optionNames || []), ...(p.safetyNames || [])];
      const hasAllOptions = filteredOption.selectedOption.every((opt) =>
        combinedOptions.includes(opt)
      );
      if (!hasAllOptions) return false;
    }

    // 4. range: 가격 범위 필터링
    if (filteredOption.range && filteredOption.range.length === 2) {
      const [min, max] = filteredOption.range;
      let price;

      if (p.type === '매매') price = p.salePrice;
      else if (p.type === '전세') price = p.deposit;
      else if (p.type === '월세') price = p.monthlyRent;

      if (price == null || price < min || price > max) return false;
    }

    // 5. room: 방 개수 필터링
    if (filteredOption.room && filteredOption.room.length === 2) {
      const [min, max] = filteredOption.room;
      if (p.rooms < min || p.rooms > max) return false;
    }

    // 6. floor: 층수 필터링
    if (filteredOption.floor && filteredOption.floor.length === 2) {
      const [min, max] = filteredOption.floor;
      if (p.floor < min || p.floor > max) return false;
    }

    // 모든 조건을 통과한 경우
    return true;
  });

}

// 매물 상세보기
const selectedProperty = ref()
const isOpenOfDetail = ref(false)
const selectProperty = (property) => {
  selectedProperty.value = property
  isOpenOfDetail.value = true
}
const detailClose = () => {
  isOpenOfDetail.value = false
}

onMounted(async()=>{
  await getPropertys()
  await getRange()
  filteredPropertys.value = propertys.value
})

watch(props.isInfo, () => filteredPropertys.value = propertys.value)
</script>

<template>
  <div class="detail-property">
    <div v-if="filterRange.area.length == 0" class="noData">등록된 매물이 없습니다.</div>
    <PropertyFilter v-if="filterRange.area.length != 0" :filterRange="filterRange" @filtering="filtering"/>
    <div v-if="filterRange.area.length != 0" class="list">
      <div class="title" style="padding-bottom: 0;">
        <i class="fa-solid fa-list-ul"></i>&ensp;List
      </div>
      <div class="deals">
        <PropertyCard
          v-for="filteredProperty in filteredPropertys"
          :key="filteredProperty.id"
          :property="filteredProperty"
          @click="selectProperty(filteredProperty)"
        ></PropertyCard>
      </div>
    </div>
    <PropertyDetail
      v-if="selectedProperty"
      :key="selectedProperty.id"
      class="detail"
      :class="{open: isOpenOfDetail}"
      @close="detailClose"
      :property="selectedProperty"
    />
  </div>
</template>

<style lang="scss" scoped>
* {
  color: white;
}
.detail-property {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

  & .noData{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5em;
  }

  & .filter {
    width: 30%;
    height: 100%;
    flex-shrink: 0;
  }

  & .list{
    width: 100%;
    height: 100%;
    padding: 2vh 5vh;

    & .deals{
      width: 100%;
      padding: 2vh 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }
  }


}

.title{
  font-size: 1.5em;
  & i{
    font-size: 1em;
  }
}
</style>
