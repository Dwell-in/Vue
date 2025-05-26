<script setup>
import { ref } from 'vue'
import HomeInfo from '@/components/home/HomeInfo.vue'
import HomeSection2 from '@/components/home/HomeSection2.vue'
import HomeSection3 from '@/components/home/HomeSection3.vue'
import HomeSection4 from '@/components/home/HomeSection4.vue'
import HomeSection5 from '@/components/home/HomeSection5.vue'
import HomeSection6 from '@/components/home/HomeSection6.vue'
import HomeSection7 from '@/components/home/HomeSection7.vue'
import HomeSection8 from '@/components/home/HomeSection8.vue'

// 버튼으로 섹션 이동
const nextSection = ref(null)
const moveSection = () => {
  nextSection.value.$el.scrollIntoView()
}

// 마우스 스크롤 가로방향
const scrollX = (e) => {
  const isSideView = e.target.closest(['.sideView', '.modal'])
  if (isSideView) return
  if (e.deltaY !== 0) {
    window.scrollBy(e.deltaY, 0) // 가로 방향으로만 스크롤
  }
}
</script>

<template>
  <main class="home" @wheel="scrollX">
    <HomeInfo :moveSection="moveSection" />
    <HomeSection2 ref="nextSection" />
    <HomeSection3 />
    <HomeSection4 />
    <HomeSection5 />
    <HomeSection6 />
    <HomeSection7 />
    <HomeSection8 />
  </main>
</template>

<style>
html:has(.home),
body:has(.home) {
  width: 100vw;
  height: 100vh;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
  background: url(@/assets/img/index.png) top / cover no-repeat;
  background-attachment: fixed;
}
body:-webkit-scrollbar {
  display: none;
}
</style>

<style lang="scss" scoped>
.home {
  display: flex;

  & section {
    width: 100vw;
    height: 100vh;
    flex-shrink: 0;
    scroll-snap-align: start;
  }
}
</style>
