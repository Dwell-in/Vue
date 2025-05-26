<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref(null)
const isVisible1 = ref(false)
const isVisible2 = ref(false)
const isVisible3 = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible1.value = true
        setTimeout(() => {
          isVisible2.value = true
        }, 500)
        setTimeout(() => {
          isVisible3.value = true
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
    <div class="aiTitle">AI</div>
    <div class="container container1" :class="{ animate: isVisible1 }">
      <img class="img" src="@/assets/img/section7_1.png" alt="" />
      <div class="info" :class="{ animate: isVisibleText }">
        <div class="title">질문도 간편하게</div>
        <div class="description">
          <p>카드 형태의 매물을 Drog&Drop하여 챗봇을 이용할 수 있습니다.</p>
        </div>
      </div>
    </div>
    <div class="container container2" :class="{ animate: isVisible2 }">
      <img class="img" src="@/assets/img/section7_2.png" alt="" />
      <div class="info">
        <div class="title">AI야 분석해줘!</div>
        <div class="description">
          <p>매물의 상세정보를 AI가 자동으로 분석합니다.</p>
        </div>
      </div>
    </div>
    <div class="container container3" :class="{ animate: isVisible3 }">
      <img class="img" src="@/assets/img/section7_3.png" alt="" />
      <div class="info">
        <div class="title">무엇이든 질문하세요.</div>
        <div class="description">
          <p>AI의 답변을 마크다운으로 파싱하여 나타냅니다.</p>
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
.aiTitle{
  position: absolute;
  top: 22vh;
  right: 30vh;
  font-size: 5em;
  color: #a7e5ff;
  font-weight: bold;
  text-shadow: 0 0 50px #ffed63;
}
.container {
  position: absolute;
  opacity: 0;

  &.animate {
    opacity: 1;
  }
  & img {
    height: 100%;
  }

  & .info {
    top: 50px;
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
      line-height: 1.5em;
      position: relative;
    }
  }

  &.container1 {
    height: 35vh;
    top: 15vh;
    left: 10vh;
    border: 1px solid #6b6e70;
    border-radius: 10px;

    & .info {
      left: 110%;
    }
  }
  &.container2 {
    height: 35vh;
    bottom: 20vh;
    right: 10vh;
    & .info {
      right: 110%;
    }
  }
  &.container3 {
    left: 25vh;
    bottom: 0;
    transform: translate(0, 50%);
    height: 65vh;
    & .info {
      top: 100px;
      left: 110%;
    }
  }
}
</style>
