<script setup>
import '@vueform/slider/themes/default.css'
import Slider from '@vueform/slider'
import { ref } from 'vue';

const priceRange = ref([0, 100])
const roomRange = ref([1, 5])
const floorRange = ref([1, 20])

const options = [
  "붙박이장",
  "천장형 에어컨",
  "식탁",
  "세탁기",
  "냉장고",
  "전자레인지",
  "TV",
  "가스레인지",
  "인터폰",
  "신발장",
  "비디오폰",
  "CCTV",
  "현관 보안",
  "경비실",
  "카드키",
  "무인택배함"
]
</script>

<template>
  <div class="filter">
    <div class="title" style="padding-bottom: 0;">
      <i class="fa-solid fa-gear" style="font-size: 1em;"></i>&ensp;Filter
    </div>
    <div class="filterForm">
      <div class="wrap type">
        <div class="title">
          <i class="fa-regular fa-square-check"></i>
          <div>매매</div>
        </div>
        <div class="title">
          <i class="fa-regular fa-square"></i>
          <div>전세</div>
        </div>
        <div class="title">
          <i class="fa-regular fa-square"></i>
          <div>월세</div>
        </div>
      </div><!-- /.wrap type -->
      <div class="wrap price slider-container">
        <div style="display: flex;justify-content: space-between; align-items: center;">
          <div class="title">
            매매가
          </div>
          <span class="rangeText">{{ priceRange[0] }}억원 ~ {{ priceRange[1] }}억원</span>
        </div>
        <Slider
          v-model="priceRange"
          :min="0"
          :max="100"
          :step="0.01"
          :showTooltip="'focus'"
        />
        <div class="range" style="line-height: 3em;">
          <div>0</div>
          <div>100억원</div>
        </div>
      </div><!-- /.wrap price -->
      <div class="wrap" style="justify-content: start;">
        <div class="title">면적</div>
        <div class="exclue">
          <div class="active">132.63</div>
          <div>133.19</div>
          <div>134.86</div>
        </div>
      </div><!-- /.wrap -->
      <div class="wrap count slider-container">
        <div class="title">방 수</div>
        <div class="slider">
          <Slider
            v-model="roomRange"
            :min="1"
            :max="5"
            :step="1"
            :showTooltip="'focus'"
          />
          <div class="range">
            <div v-for="(room, index) in 5" :key="index">{{ index+1 }}</div>
          </div>
        </div>
      </div><!-- /.wrap -->
      <div class="wrap count slider-container">
        <div class="title">층 수</div>
        <div class="slider">
          <Slider
            v-model="floorRange"
            :min="1"
            :max="20"
            :step="1"
            :showTooltip="'focus'"
          />
          <div class="range">
            <div>1</div>
            <div>20</div>
          </div>
        </div>
      </div><!-- /.wrap -->
      <div class="wrap option">
        <div class="title">옵션</div>
        <div class="options">
          <div :class="{active: index==1}" v-for="(option, index) in options" :key="option">{{ option }}</div>
        </div>
      </div><!-- /.wrap -->
    </div><!-- /.filterForm -->
  </div>
</template>


<style lang="scss" scoped>
.wrap{
  width: 100%;
  display: flex;
  justify-content: space-between;

  & .title{
    width: 20%;
    flex-shrink: 0;
  }
}
.title{
  padding: 2vh 0;
  font-size: 1.5em;
  & *:not(span) {
    font-size: 1em;
  }
}
.active{
  background-color: #3b3b3b;
  border-radius: 10px;
  padding: 5px 10px;
}
.slider-container {
  flex-direction: column;
  justify-content: space-between;

  & .title{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  & .rangeText{
    text-align: end;
  }
  & .slider-target{
    width: 100%;
    padding: 0 10px;
  }
  & :deep(.slider-tooltip){
    background-color: #49B4E6;
  }
  & :deep(.slider-connect){
    background-color: #49B4E6;
  }
  & .range{
    display: flex;
    justify-content: space-between;
    line-height: 2em;
  }
}
.type{
  justify-content: start;
  gap: 30px;

  & > div{
    display: flex;
    align-items: center;
    gap: 20px;

    & i{
      cursor: pointer;
    }
  }
}
.count{
  flex-direction: row;
  align-items: center;
  justify-content: start;
  height: calc(4vh + 40px);

  & .slider{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
  }

  & .range{
    margin-top: 5px;
  }
}
.exclue{
  display: flex;
  align-items: center;
  gap: 10px;
}
.wrap.option{
  flex-direction: column;

  & .options{
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    & > div{
      cursor: pointer;
    }
  }
}
</style>
