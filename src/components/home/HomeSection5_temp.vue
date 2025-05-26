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
        }, 500)
        setTimeout(() => {
          isVisibleText.value = true
        }, 1500)
      }
    },
    {
      threshold: 0.5, // 50% 이상 보이면 감지
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
    <!-- <img class="img1" src="@/assets/img/section2_1.png" alt="" :class="{ animate: isVisibleBox }" /> -->
    <div class="info" :class="{ animate: isVisibleText }">
      <div class="title">페이지를 한 눈에</div>
      <div class="description">
        <p>우리는 사용자의 '머무름'이 끊기지 않기를 바랍니다.</p>
      </div>
    </div>
    <div class="img2" :class="{ animate: isVisibleBox }">
      <img class="img" src="@/assets/img/section5_2.png" alt="" />
      <img class="gif" src="@/assets/img/section5_2.gif" alt="" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  background: #000000aa;
  position: relative;
  overflow: hidden;

  & * {
    transition: 1s;
  }
}
.info {
  position: absolute;
  top: 20vh;
  left: 45vw;
  color: white;
  opacity: 0;

  & .title {
    font-size: 2.5em;
    font-weight: 600;
    margin-bottom: 20px;
  }
  & .description p {
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
  width: 80vh;
  height: 50vh;
  position: absolute;
  bottom: 8vh;
  left: 10vw;
  opacity: 0;

  &.animate {
    opacity: 1;
  }
  & .img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  & .gif {
    position: absolute;
    width: 90%;
    height: 90%;
    top: 5%;
    left: 5%;
  }
}
</style>
