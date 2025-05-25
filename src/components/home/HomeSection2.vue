<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref(null)
const isVisibleBox = ref(false)
const isVisibleText = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          isVisibleBox.value = true
        }, 500);
        setTimeout(() => {
          isVisibleText.value = true
        }, 1500);
      }
    },
    {
      threshold: 0.5, // 50% 이상 보이면 감지
    }
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
    <img class="img1" src="@/assets/img/section2_1.png" alt="" :class="{ animate: isVisibleBox }">
    <img class="img2" src="@/assets/img/section2_2.png" alt="" :class="{ animate: isVisibleBox }">
    <div class="info" :class="{ animate: isVisibleText }">
      <div class="title">
        페이지를 한 눈에
      </div>
      <div class="description">
        <p>
          우리는 사용자의 '머무름'이 끊기지 않기를 바랍니다.
        </p>
        <p>
          Dwell-In은 다양한 팝업과 사이드바를 통해, 페이지 이동을 최소화 하고 원하는 정보를 곧바로 만날 수 있도록 지원합니다.
        </p>
        <p>
          당신의 공간을 알아가는 여정이 매끄럽고 직관적일 수 있도록..
        </p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  background: linear-gradient(to right, #00000000 0%, #00000080 50%, #000000aa 100%);
  position: relative;
  overflow: hidden;

  & *{
    transition: 1s;
  }
}
.info{
  position: absolute;
  top: 20vh;
  left: 45vw;
  color: white;
  opacity: 0;

  & .title{
    font-size: 2.5em;
    font-weight: 600;
    margin-bottom: 20px;
  }
  & .description p{
    font-size: 1.2em;
    line-height: 1.5em;
  }

  &.animate {
    opacity: 1;
  }
}
.img1 {
  width: 35vw;
  position: absolute;
  top: 20vh;
  left: -40vw;

  &.animate {
    left: 5vw;
  }
}
.img2 {
  height: 50vh;
  position: absolute;
  bottom: -55vh;
  right: 7vw;

  &.animate {
    bottom: 8vh;
  }
}
</style>
