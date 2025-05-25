<script setup>
import api from '@/lib/api';
import { useLoginUserStore } from '@/stores/loginUser';
import { useSideStore } from '@/stores/side';
import { useChatStore } from '@/stores/chatStore'
import defaultImg from '@/assets/img/loginbg.png'
import { mapImgOn } from '@/lib/kakao'
import { onMounted, ref } from 'vue';


const loginUserStore = useLoginUserStore()
const sideStore = useSideStore()
const chatStore = useChatStore()

const props = defineProps({
  property: Object
})

const price = props.property?.type == '매매'? props.property.salePrice
              : props.property?.type == '전세' ? props.property.deposit
              : props.property?.monthlyRent
const formatToEokMan = v => `${Math.floor(v / 100000000)}억 ${Math.floor(v % 100000000 / 10000)}만원`.replace(/^0억 /, '').replace(/ 0만원$/, '');

// 맵 가져오기
const map = ref()
const getMap = async () => {
  const res = await api.get(`/api/v1/house/${props.property?.aptSeq}`)
  mapImgOn(map.value, res.data.data.lat, res.data.data.lon)
}

// 채팅방 연결
const connectChat = async () => {
  chatStore.selectTarget({
    id: props.property.memberId
  })
  await api.get('/chat/roomId',  {
    params: {
      user1Id: loginUserStore.id,
      user2Id: props.property.memberId
    }
  })

  sideStore.chatToggle(false)
  sideStore.chatToggle(true)
}

onMounted(async ()=>{
  await getMap()
})
</script>

<template>
  <div class="detail">
    <i class="fa-solid fa-xmark closeIcon" @click="$emit('close')"></i>
    <div class="left">
      <img class="propertyImg" :src="props.property?.propertyImg" @error="(e) => e.target.src = defaultImg" alt="">
      <div class="mapImg" ref="map"></div>
    </div>
    <div>
      <div class="price">{{ props.property?.type }}&ensp;{{ formatToEokMan(price) }}</div>
      <div class="option1">
        <div><i class="fa-solid fa-building"></i>&ensp;{{ props.property?.structureType }}</div>
        <div><i class="fa-solid fa-stairs"></i>&ensp;{{ props.property?.floor }}층</div>
        <div><i class="fa-solid fa-ruler-combined"></i>&ensp;{{ props.property?.supplyArea }}m²</div>
        <div><i class="fa-solid fa-won-sign"></i>&ensp;{{ props.property?.managementFee.toLocaleString() }}</div>
        <div><i class="fa-regular fa-compass"></i>&ensp;{{ props.property?.direction }}</div>
      </div>
      <div class="title">
        {{ props.property?.title }}
      </div>
      <div class="description">
        <!-- {{ props.property?.description }} -->
        <p>- 강남역 5분거리, 서울도심~경기도 방면 버스노선 집중, 공항 리무진 정거장 인접</p>
        <p>- 고층, 동향으로 뷰 확보, 맑은날 월드타워 보임</p>
        <p>- 구축 오피스텔(아파트) 이지만 레지던스 호텔로 계속 운영되던 곳이라 관리가 잘 되어있음</p>
        <p>- 신축대비 아주 넓은 실내 면적, 베란다 있음</p>
        <p>- 화장실까지 올수리, 붙박이 가구 및 LG 오브제 워시타워, 인덕션, 에어컨 등 새가전 신혼부부 첫 입주로 완비되어 있음</p>
        <p>- 지하에 헬스장, 사우나가 있어서 아주 편리</p>
        <p>- 강남역 신논현 방면의 번화가와 다르게 삼성타운 뒷편 주거단지 쪽이라 조용함</p>
        <p>- 올리브영, 스타벅스, 맥도날드, 베스킨, 던킨 그리고 많은 약국과 병원들로 생활이 편리함</p>
        <p></p>
        <p>- 신혼부부 첫 시작하는 집으로 추천합니다.</p>
      </div>
    </div>
    <div class="chatIcon" @click="connectChat"><i class="fa-solid fa-comment"></i></div>
  </div>
</template>


<style lang="scss" scoped>
.detail{
  width: 0;
  height: 0;
  overflow: hidden;
  position: absolute;
  z-index: 30;
  background-color: #1D1D1D;
  transition: none;
  border-radius: 20px;
  display: flex;
  gap: 40px;

  &.open{
    width: 68%;
    height: 98%;
    top: 2%;
    left: 32%;
    padding: 4vh;
  }

  & .left{
    width: 40%;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;

    & *{
      width: 100%;
      height: 100%;
      box-shadow: 0 0 10px 1px black;
      border-radius: 10px;
    }
  }
}

.closeIcon{
  font-size: 2em;
  position: absolute;
  top: 1.5vh;
  right: 2vh;
  cursor: pointer;
}
.chatIcon{
  position: absolute;
  bottom: 3vh;
  right: 2vh;
  width: 5vh;
  height: 5vh;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  cursor: pointer;
  box-shadow: 0 0 1px 1px white;
  & i{
    color: #A2D4FB;
    font-size: 2.5vh;
  }
}

.price{
  font-size: 2.5rem;
  line-height: 2em;
  font-weight: bold;
}
.option1{
  display: flex;
  gap: 20px;
  color: #c1c1c1;
}
.title{
  font-size: 1.5rem;
  line-height: 3em;
}
.description{
  line-height: 1.5em;
}
</style>
