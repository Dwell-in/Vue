<script setup>
import { ref, onMounted, watch } from 'vue'
import { createMap, addressSearch, localSearchAll, maker_Toggle } from '@/lib/kakao.js'
import { useRoute } from 'vue-router'
import api from '@/lib/api'

const markers = ['FD6', 'CE7', 'SC4', 'HP8', 'BK9', 'CS2']
const mapContainer = ref()
const route = useRoute()
let fullAddress;

const props = defineProps({
  kakao: Object,
  loading: Boolean,
})
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
const init = async () => {
  emit('update:loading', true)
  const res = await searchHouseInfo(props.kakao)
  await addressSearch(props.kakao, fullAddress, res.data.data)
  emit('update:loading', false)
  localSearchAll(props.kakao)
}

onMounted(async () => {
  await createMap(props.kakao, mapContainer.value, 4)
  await init()
})
watch(() => route.fullPath, async () => {
  await init()
})

const markerToggle = (event) => {
  const mk = event.currentTarget
  const prev = mk.getAttribute("data-makerToggle") === "true"
  const next = !prev
  mk.setAttribute("data-makerToggle", next)
  maker_Toggle(mk.getAttribute("data-markerName"), next)
}
</script>

<template>
  <div id="mapBox" ref="mapContainer"></div>
  <div class="maker-btn">
    <img
      v-for="(marker, index) in markers"
      :key="index"
      class="marker"
      data-makerToggle="false"
      :src="`/src/assets/img/marker_${marker}_btn.png`"
      :alt="`marker_${marker}_btn`"
      :data-markerName="marker"
      @click="markerToggle"
    />
  </div>
</template>

<style  scoped>

#mapBox {
  width: 100%;
  height: 100%;
}

.maker-btn {
  display: flex;
  height: 3vh;
  justify-content: flex-start;
  gap: 1vw;
  position: absolute;
  top: 2vw;
  left: 3vw;
  z-index: 5;
}

.maker-btn > img {
  height: 100%;
  cursor: pointer;
}

:deep(.overlay) {
  padding: 1vh 2vh;
  background-color: #343434d1;
  border: 5px double black;
  box-shadow: 0 0.3vh 1vh black;
  color: white;
  font-size: 0.6em;
  line-height: 1em;
}
</style>
