<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref(null)
const isVisibleBox = ref(false)
const isVisibleText = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisibleBox.value = true
        setTimeout(() => {
          isVisibleText.value = true
        }, 1000)
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
    <div class="container" :class="{ animate: isVisibleBox }">
      <img class="img" src="@/assets/img/section6_1.png" alt="" />
      <div class="info" :class="{ animate: isVisibleText }">
        <div class="title">실시간으로 문의하세요!</div>
        <div class="description">
          <p>매물 페이지에서 바로 판매자와 채팅이 가능합니다.</p>
          <p>전화번호 없이도 안전하게 문의하고 빠르게 소통하세요.</p>
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
  height: 65vh;
  position: absolute;
  bottom: 10vh;
  right: 22vw;
  opacity: 0;

  &.animate {
    opacity: 1;
  }
  & img {
    height: 100%;
  }

  & .info {
    position: absolute;
    width: fit-content;
    white-space: nowrap;
    top: 10%;
    right: 200%;
    overflow: hidden;

    & .title {
      font-size: 2em;
      font-weight: 600;
      margin-bottom: 20px;
      position: relative;
      left: 100%;
    }
    & .description p {
      font-size: 1.2em;
      line-height: 1.5em;
      position: relative;
      left: 100%;
    }
    &.animate .title,
    &.animate .description p {
      left: 0;
    }
  }
}
</style>
