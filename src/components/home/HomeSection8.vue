<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref(null)
const isVisible1 = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible1.value = true
      }
    },
    {
      threshold: 1,
    },
  )
  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }

  onUnmounted(() => {
    if (sectionRef.value) observer.unobserve(sectionRef.value)
  })
})
</script>

<template>
  <section ref="sectionRef">
    <div class="container container1" :class="{ animate: isVisible1 }">
      <img class="img" src="@/assets/img/section8_1.png" alt="" />
      <div class="info">
        <div class="title">“어디서 많이 본 디자인 같지 않나요?”</div>
        <div class="description">
          <p>네, 맞습니다.</p>
          <p>
            저희는 SSAFY 교육생으로, 1학기 동안 배운 내용을 바탕으로 친숙한 디자인과 기능을 직접
            구현해봤습니다.
          </p>
          <p>본 프로젝트는 공부하고, 실험하고, 성장하기 위해 만든 작품입니다!</p>
          <p>저희 프로젝트의 모든 것은 기술노트 “Dwellog”에 기록되어 있습니다.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  background: #000000aa;
  position: relative;
  color: white;
  overflow: hidden;

  & * {
    transition: 1s;
  }
}
.container {
  position: absolute;
  opacity: 0;
  height: 55vh;
  top: 20vh;
  left: 5vw;
  border: 1px solid #6b6e70;
  border-radius: 10px;

  &.animate {
    opacity: 1;
  }
  & img {
    height: 100%;
  }

  & .info {
    top: 50%;
    transform: translate(0, -50%);
    left: 110%;
    position: absolute;
    width: fit-content;
    white-space: nowrap;

    & .title {
      font-size: 2em;
      font-weight: 600;
      margin-bottom: 20px;
      position: relative;
    }
    & .description p {
      font-size: 1.2em;
      line-height: 1.8em;
      position: relative;
    }
  }
}
</style>
