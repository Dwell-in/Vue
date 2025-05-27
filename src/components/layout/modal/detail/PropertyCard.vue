<script setup>
import defaultImg from '@/assets/img/loginbg.png'

const props = defineProps({
  property: Object,
  isHighlighted: Boolean,
})

const price =
  props.property?.type == '매매'
    ? props.property.salePrice
    : props.property?.type == '전세'
      ? props.property.deposit
      : props.property.monthlyRent

const formatToEokMan = (v) =>
  `${Math.floor(v / 100000000)}억 ${Math.floor((v % 100000000) / 10000)}만원`
    .replace(/^0억 /, '')
    .replace(/ 0만원$/, '')
</script>

<template>
  <div class="deal-apt-card">
    <div v-if="isHighlighted" class="badge">AI 추천 매물</div>
    <img
      :src="props.property.propertyImg || defaultImg"
      alt="아파트 이미지"
      class="deal-apt-image"
    />

    <div class="deal-apt-info">
      <div class="deal-apt-title">
        <strong class="price">{{ props.property.type }}&ensp;{{ formatToEokMan(price) }}</strong>
        <span class="deal-apt-name">{{ props.property.aptName }}</span>
      </div>

      <div class="deal-apt-details">
        {{ props.property.floor }}층 · {{ parseFloat(props.property.supplyArea.toFixed(2)) }}m² ·
        관리비 {{ props.property.managementFee }}
      </div>

      <div class="deal-apt-tags">
        <div v-for="option in props.property.optionNames" :key="option">{{ option }}</div>
        <div v-for="option in props.property.safetyNames" :key="option">{{ option }}</div>
      </div>

      <!-- <div class="deal-apt-badge">
        <span>{{  }}</span>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.deal-apt-card {
  width: 100%;
  height: 200px;
  padding: 15px;
  display: flex;
  gap: 20px;
  background-color: white;
  color: black;
  border-radius: 20px;
  box-shadow: 0 0 2px 1px white;
  cursor: pointer;
  position: relative;
}

.deal-apt-image {
  height: 100%;
  border-radius: 10px;
  width: 45%;
}

.deal-apt-info {
  display: flex;
  flex-direction: column;
  padding: 1vh;
}

.deal-apt-title {
  display: flex;
  flex-direction: column;

  & .price {
    font-size: 1.3rem;
    margin-bottom: 1vh;
  }
}

.deal-apt-name {
  font-size: 0.9rem;
  color: #666;
  margin-top: 4px;
}

.deal-apt-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  gap: 5px;

  & > div {
    font-size: 0.8rem;
    background-color: #e5e5e5;
    border-radius: 5px;
    padding: 3px 5px;
  }
}

.deal-apt-details {
  font-size: 0.9rem;
  color: #333;
  margin-top: 4px;
}

.deal-apt-badge span {
  display: inline-block;
  font-size: 0.8rem;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 6px;
}
.badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: red;
  color: white;
  font-size: 0.9em;
  padding: 3px 7px;
  border-radius: 5px;
  z-index: 2;
  font-weight: bold;
}
</style>
