<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref(null)
const isVisibleLine = ref(false)
const isVisibleText = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          isVisibleLine.value = true
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
    <div class="container">
      <img class="img" src="@/assets/img/section4_1.png" alt="" />
      <div class="innerContainer info" :class="{ animate: isVisibleLine }">
        <div class="line"></div>
        <i class="fa-solid fa-chevron-left"></i>
        <div class="text" :class="{ animate: isVisibleText }">건물의 상세 정보가 나타납니다.</div>
      </div>
      <div class="innerContainer ai" :class="{ animate: isVisibleLine }">
        <div class="line"></div>
        <i class="fa-solid fa-chevron-left"></i>
        <div class="text" :class="{ animate: isVisibleText }">AI의 추천을 받아보세요.</div>
      </div>
      <div class="innerContainer chart" :class="{ animate: isVisibleLine }">
        <div class="line"></div>
        <i class="fa-solid fa-angle-up"></i>
        <div class="text" :class="{ animate: isVisibleText }">
          거래 현황을 그래프로 확인할 수 있습니다.
        </div>
      </div>
      <div class="innerContainer roadView" :class="{ animate: isVisibleLine }">
        <div class="line"></div>
        <i class="fa-solid fa-chevron-right"></i>
        <div class="text" :class="{ animate: isVisibleText }">
          로드뷰로 정확한 실사진을 볼 수 있습니다.
        </div>
      </div>
      <div class="innerContainer blog" :class="{ animate: isVisibleLine }">
        <div class="line"></div>
        <i class="fa-solid fa-chevron-right"></i>
        <div class="text" :class="{ animate: isVisibleText }">
          블로그와 뉴스 바로가기가 생성됩니다.
        </div>
      </div>
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
    color: white;
  }
}

.container {
  height: 60vh;
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);

  & img {
    height: 100%;
  }

  & .innerContainer {
    width: 0;
    height: 3px;
    background-color: white;
    position: absolute;

    & i {
      position: absolute;
      transform: translate(0, -40%);
      font-size: 20px;
    }

    & .text {
      position: absolute;
      transform: translate(0, -50%);
      width: fit-content;
      white-space: nowrap;
      opacity: 0;
      font-size: 1.2em;

      &.animate {
        opacity: 1;
      }
    }

    &.info {
      top: 20%;
      right: 92%;
      &.animate {
        width: 16%;
      }
      & i {
        right: calc(100% - 10px);
      }
      & .text {
        right: 110%;
      }
    }

    &.ai {
      bottom: 40%;
      right: 92%;
      &.animate {
        width: 16%;
      }
      & i {
        right: calc(100% - 10px);
      }
      & .text {
        right: 110%;
      }
    }
    &.chart {
      bottom: 82%;
      left: 45%;
      &.animate {
        width: 3px;
        height: 25%;
      }
      & i {
        transform: translate(-40%, -40%);
      }
      & .text {
        bottom: 105%;
        transform: translate(-50%, -50%);
      }
    }

    &.roadView {
      top: 40%;
      left: 92%;
      &.animate {
        width: 16%;
      }
      & i {
        left: calc(100% - 10px);
      }
      & .text {
        left: 110%;
      }
    }

    &.blog {
      bottom: 26%;
      left: 92%;
      &.animate {
        width: 16%;
      }
      & i {
        left: calc(100% - 10px);
      }
      & .text {
        left: 110%;
      }
    }
  }
}
</style>
