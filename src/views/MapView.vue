<script setup>
import { onMounted, ref } from 'vue'
import { loadScript } from '@/lib/loadScript'
import Header from '@/components/header/Header.vue'
import Footer2 from '@/components/footer/Footer2.vue'
import KaKaoMap from '@/components/map/KaKaoMap.vue'
import SideDetail from '@/components/side/SideDetail.vue'
import { init } from '@/lib/kakao'

// fontawesome CDN
onMounted(() => {
  loadScript('https://kit.fontawesome.com/64319e1cb9.js', true)
})
const loading = ref(true)

const readyToAPI = ref(false)

onMounted(async () => {
  await init()
  readyToAPI.value = true
})
</script>

<template>
  <Header></Header>
  <main>
    <div id="map">
      <div class="loading" :class="{ 'display-none': !loading }">
        <i class="fa-solid fa-spinner fa-spin fa-fade fa-5x"></i>
      </div>
      <KaKaoMap v-if="readyToAPI" v-model:loading="loading"></KaKaoMap>
    </div>
    <SideDetail v-if="readyToAPI"></SideDetail>
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
