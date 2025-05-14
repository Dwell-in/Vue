<script setup>
import { onMounted, ref } from 'vue'
import { loadScript } from '@/lib/loadScript'
import Header from '@/components/header/Header.vue'
import KaKaoMap from '@/components/map/KaKaoMap.vue'
import { init } from '@/lib/kakao'
// finia
import { useSideStore } from '@/stores/side'
const store = useSideStore()

// fontawesome CDN
onMounted(() => {
  loadScript('https://kit.fontawesome.com/64319e1cb9.js', true)
})
const loading = ref(true)

const readyToAPI = ref(false)

onMounted(async () => {
  await init(store)
  readyToAPI.value = true
})
</script>

<template>
  <Header></Header>
  <main class="map">
    <div id="map">
      <div class="loading" :class="{ 'display-none': !loading }">
        <i class="fa-solid fa-spinner fa-spin fa-fade fa-5x"></i>
      </div>
      <KaKaoMap v-if="readyToAPI" v-model:loading="loading"></KaKaoMap>
    </div>
  </main>
</template>

<style scoped>
main {
  margin-top: 65px;
  width: 100%;
  height: calc(100vh - 65px);
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
