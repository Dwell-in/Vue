<script setup>
import { ref, onMounted } from 'vue'
import { loadScript } from '@/lib/loadScript'
import Header from '@/components/header/Header.vue'
import Footer2 from '@/components/footer/Footer2.vue'
import { createMap, addressSearch } from '@/lib/kakao.js'
import { useRoute } from 'vue-router'
import api from '@/lib/api'

// fontawesome CDN
onMounted(() => {
  loadScript('https://kit.fontawesome.com/64319e1cb9.js', true)
})

const markers = ['FD6', 'CE7', 'SC4', 'HP8', 'BK9', 'CS2']

const mapContainer = ref()

// 카카오Map API 호출
const loadKakaoMap = async () => {
  if (window.kakao && window.kakao.maps) return window.kakao
  await loadScript(
    `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services,clusterer,drawing&autoload=false`,
  )
  return new Promise((resolve) => {
    window.kakao.maps.load(() => resolve(window.kakao))
  })
}

// 주소 검색 rest API 호출
const loading = ref(true)
const route = useRoute()
const searchHouseInfo = async (kakao) => {
  loading.value = true

  const fullAddress = decodeURIComponent(route.path.split('/')[2] || '')
  const [sido, gugun, dong] = fullAddress.split(' ')

  const query = new URLSearchParams({
    sido,
    gugun,
    dong,
  }).toString()

  const res = await api.get(`/api/v1/house?${query}`)

  await addressSearch(kakao, mapContainer.value, fullAddress)
  console.log(res.data.data)
  loading.value = false

  // await createMarker(res.data.data)
}

onMounted(async () => {
  const kakao = await loadKakaoMap()
  await createMap(kakao, mapContainer.value, 4)
  await searchHouseInfo(kakao)
})
</script>

<template>
  <Header></Header>
  <main>
    <div id="map">
      <div class="loading" :class="{ 'display-none': !loading }">
        <i class="fa-solid fa-spinner fa-spin fa-fade fa-5x"></i>
      </div>
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
        />
      </div>
    </div>
  </main>
  <Footer2></Footer2>
</template>

<style scoped>
main {
  margin-top: 65px;
  width: 100%;
  height: calc(100vh - 130px);
}

#map {
  width: 100%;
  height: 100%;
}

#mapBox {
  width: 100%;
  height: 100%;
}

.loading {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.384);
  position: absolute;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
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

.overlay {
  padding: 1vh 2vh;
  background-color: #343434d1;
  border: 5px double black;
  box-shadow: 0 0.3vh 1vh black;
  color: white;
  font-size: 0.6em;
  line-height: 1em;
}

@keyframes up {
  0% {
    top: 0%;
  }
  100% {
    top: -100%;
  }
}

.up {
  animation: up 1s ease forwards;
}
</style>
