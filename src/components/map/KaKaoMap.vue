<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  state,
  createMap,
  addressSearch,
  localSearchAll,
  maker_Toggle,
  overlayToggle,
} from '@/lib/kakao.js'
import { useRoute } from 'vue-router'
import api from '@/lib/api'
import { useSideStore } from '@/stores/side'
import makerBtn1 from '@/assets/img/marker_FD6_btn.png'
import makerBtn2 from '@/assets/img/marker_CE7_btn.png'
import makerBtn3 from '@/assets/img/marker_SC4_btn.png'
import makerBtn4 from '@/assets/img/marker_HP8_btn.png'
import makerBtn5 from '@/assets/img/marker_BK9_btn.png'
import makerBtn6 from '@/assets/img/marker_CS2_btn.png'

const store = useSideStore()

const markers = ['FD6', 'CE7', 'SC4', 'HP8', 'BK9', 'CS2']
const markerBtns = [makerBtn1, makerBtn2, makerBtn3, makerBtn4, makerBtn5, makerBtn6]
const mapContainer = ref()
const route = useRoute()
let fullAddress

const emit = defineEmits(['update:loading'])

// 매물 검색 restAPI
const searchHouseInfo = async () => {
  fullAddress = decodeURIComponent(route.path.split('/')[2] || '')
  const [sido, gugun, dong] = fullAddress.split(' ')

  const query = new URLSearchParams({
    sido,
    gugun,
    dong,
  }).toString()

  return await api.get(`/api/v1/house?${query}`)
}

// 매물 검색 + 카카오 맵 초기화
const infos = ref()
const init = async () => {
  emit('update:loading', true)
  const res = await searchHouseInfo()
  infos.value = res.data.data
  await addressSearch(fullAddress, res.data.data)
  emit('update:loading', false)
  localSearchAll()
}

onMounted(async () => {
  await createMap(mapContainer.value)
  await init()
})
watch(
  () => route.fullPath,
  async () => {
    await init()
  },
)

const markerToggle = (event) => {
  const mk = event.currentTarget
  const prev = mk.getAttribute('data-makerToggle') === 'true'
  const next = !prev
  mk.setAttribute('data-makerToggle', next)
  maker_Toggle(mk.getAttribute('data-markerName'), next)
}

// 검색된 리스트
const toggle = ref(true)
const listSelect = (index) => {
  state.info = infos.value[index]
  store.detailToggle(true)
}
</script>

<template>
  <div class="houseList" :class="{ on: toggle }">
    <div class="maker-btn">
      <img
        v-for="(marker, index) in markers"
        :key="marker"
        class="marker"
        :src="markerBtns[index]"
        :alt="`marker_${marker}_btn`"
        data-makerToggle="false"
        :data-markerName="marker"
        @click="markerToggle"
      />
      <svg
        class="toggleBtn"
        @click="toggle = !toggle"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="white"
      >
        <!-- fill="#e3e3e3" -->
        <path
          d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm280-80h280v-560H480v560Z"
        />
      </svg>
    </div>
    <template v-if="toggle">
      <template v-for="(info, index) in infos" :key="info.aptSeq">
        <div
          class="house"
          v-if="info.lat != 0"
          @click="listSelect(index)"
          @mouseover="overlayToggle(index, true)"
          @mouseout="overlayToggle(index, false)"
        >
          <div>
            <div class="aptNm">{{ info.aptNm }}</div>
            <div class="roadNm">
              {{ info.roadNm }}
              <template v-if="info.roadNmBonbun !== '0'">{{ info.roadNmBonbun }}</template
              ><template v-if="info.roadNmBubun !== '0'">-{{ info.roadNmBubun }}</template>
            </div>
          </div>
          <img class="aptImg" src="@/assets/img/loginbg.png" alt="" />
        </div>
      </template>
    </template>
  </div>
  <div id="mapBox" ref="mapContainer"></div>
</template>

<style scoped>
.houseList {
  width: 30vh;
  height: calc(100% - 65px);
  background-color: #343434ec;
  position: fixed;
  top: 65px;
  left: 0;
  z-index: 30;
  overflow-y: scroll;
  -ms-overflow-style: none;
  /* 인터넷 익스플로러 */
  scrollbar-width: none;
  /* 파이어폭스 */
  text-align: end;
}

.houseList:not(.on) {
  height: auto;
  top: calc(65px + 1vh);
  left: 1vh;
  border-radius: 10px;
}

/* ( 크롬, 사파리, 오페라, 엣지 ) 동작 */
.houseList:-webkit-scrollbar {
  display: none;
}

.house {
  height: 10vh;
  background-color: white;
  box-shadow: 0 0 10px #4ab5e6;
  margin: 0 5%;
  padding: 5%;
  border-radius: 10px;
  text-align: start;
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}
.house + .house {
  margin-top: 10%;
}
.house:hover {
  top: -0.5vh;
}

.house > div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.aptNm {
  font-size: 0.8em;
  margin-bottom: 1em;
}

.roadNm {
  font-size: 0.6em;
  color: #7e7e7e;
}

.aptImg {
  height: 100%;
  aspect-ratio: 1;
  top: 10%;
  right: 5%;
  border-radius: 5px;
}

.maker-btn {
  display: flex;
  height: 24px;
  justify-content: space-evenly;
  align-items: center;
  margin: 2vh 0.5vh;
}
.on .maker-btn {
  margin: 3vh 0.5vh;
}

.maker-btn > img {
  height: 100%;
  cursor: pointer;
}
.maker-btn > * {
  cursor: pointer;
}

#mapBox {
  width: 100%;
  height: 100%;
}

:deep(.overlay) {
  padding: 1vh 2vh;
  background-color: #343434ec;
  border: 1px solid rgb(66, 66, 66);
  box-shadow: 0 0.3vh 1vh black;
  border-radius: 5px;
  color: white;
  font-size: 0.6em;
  line-height: 1em;
}
</style>
