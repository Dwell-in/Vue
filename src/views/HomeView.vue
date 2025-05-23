<script setup>
import { ref } from 'vue'
import HomeInfo from '@/components/home/HomeInfo.vue'
import Section2 from '@/components/home/Section2.vue'
import Section3 from '@/components/home/Section3.vue'
import Section4 from '@/components/home/Section4.vue'
import LayoutHeader from '@/components/layout/header/LayoutHeader.vue'

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
  <LayoutHeader :isMainHeader="true"></LayoutHeader>
  <main class="home" @wheel="scrollX">
    <HomeInfo :moveSection="moveSection"></HomeInfo>
    <Section2 ref="nextSection"></Section2>
    <Section3></Section3>
    <Section4></Section4>
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
  /* 인터넷 익스플로러 */
  scrollbar-width: none;
  /* 파이어폭스 */
}
/* ( 크롬, 사파리, 오페라, 엣지 ) 동작 */
body:-webkit-scrollbar {
  display: none;
}
.home {
  display: flex;
}
.home section {
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  scroll-snap-align: start;
}
</style>
