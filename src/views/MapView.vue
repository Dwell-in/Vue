<script setup>
import { onMounted, ref } from 'vue'
import { loadScript } from '@/lib/loadScript'
import Header from '@/components/header/Header.vue'
import Footer2 from '@/components/footer/Footer2.vue'
import KaKaoMap from '@/components/map/KaKaoMap.vue'
import DetailSide from '@/components/side/detail/DetailSide.vue'
import { state } from '@/lib/kakao'

// fontawesome CDN
onMounted(() => {
  loadScript('https://kit.fontawesome.com/64319e1cb9.js', true)
})
const loading = ref(true)

// 카카오 Map API 호출, kakao 객체 받아오기
const kakaoReady = ref(false)
const loadKakaoMap = async () => {
  if (window.kakao && window.kakao.maps) return window.kakao
  await loadScript(
    `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services,clusterer,drawing&autoload=false`,
  )
  return new Promise((resolve) => {
    window.kakao.maps.load(() => resolve(window.kakao))
  })
}

onMounted(async () => {
  state.kakao = await loadKakaoMap()
  kakaoReady.value = true
})
</script>

<template>
  <Header></Header>
  <main>
    <div id="map">
      <div class="loading" :class="{ 'display-none': !loading }">
        <i class="fa-solid fa-spinner fa-spin fa-fade fa-5x"></i>
      </div>
      <KaKaoMap v-if="kakaoReady" v-model:loading="loading"></KaKaoMap>
    </div>
    <DetailSide v-if="state.info"></DetailSide>
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
</style>
