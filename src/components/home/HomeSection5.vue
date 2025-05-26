<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import section1 from '@/assets/img/section5_1.png'
import section2 from '@/assets/img/section5_2.png'

const sectionRef = ref(null)
const isVisibleLine = ref(false)
const isVisibleText = ref(false)
const isVisibleLine2 = ref(false)
const isVisibleText2 = ref(false)

const imgs = [section1, section2]
const chapter = ref(0)
const nextChapter = () => {
  chapter.value = 1
  isVisibleLine.value = false
  isVisibleText.value = false
  setTimeout(() => {
    isVisibleLine2.value = true
    isVisibleText2.value = true
  }, 500)
}

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisibleLine2.value = false
        isVisibleText2.value = false
        isVisibleLine.value = true
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
    <div class="container">
      <i class="fa-solid fa-angle-right next" @click="nextChapter" v-if="isVisibleText"></i>
      <img class="img" :src="imgs[chapter]" alt="" />
      <div class="innerContainer filter" :class="{ animate: isVisibleLine }">
        <div class="line"></div>
        <i class="fa-solid fa-chevron-left"></i>
        <div class="text" :class="{ animate: isVisibleText }">매물을 필터링하여 검색하세요.</div>
      </div>
      <div class="innerContainer chat" :class="{ animate: isVisibleLine2 }">
        <div class="line"></div>
        <i class="fa-solid fa-chevron-right"></i>
        <div class="text" :class="{ animate: isVisibleText2 }">
          판매자와 실시간 채팅이 가능합니다.
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

  & .next {
    position: absolute;
    cursor: pointer;
    bottom: 102%;
    right: 2%;
    font-size: 2em;
  }

  & img {
    height: 100%;
  }

  & .innerContainer {
    width: 0;
    height: 3px;
    background-color: white;
    position: absolute;
    overflow: hidden;

    &:has(.animate) {
      overflow: visible;
    }

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

    &.filter {
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

    &.chat {
      bottom: 19%;
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
