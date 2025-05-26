<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref(null)
const isVisibleBox = ref(false)
const isVisibleBox2 = ref(false)
const isVisibleText = ref(false)
const isVisibleText2 = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisibleBox.value = true
        setTimeout(() => {
          isVisibleText.value = true
        }, 1000)
        setTimeout(() => {
          isVisibleBox2.value = true
          isVisibleText2.value = true
        }, 2000)
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
    <div class="container1" :class="{ animate: isVisibleBox }" >
      <img class="img1" src="@/assets/img/section3_1.png" />
      <div class="info1" :class="{ animate: isVisibleText }">
        <div class="title">검색은 빠르게, 입력은 간단하게</div>
        <div class="description">
          <p>
            자동완성 기능으로 원하는 지역이나 아파트명을 몇 글자만 입력해도 빠르게 찾아볼 수 있습니다.
          </p>
        </div>
      </div>
    </div>

    <div class="container2" :class="{ animate: isVisibleBox2 }">
      <img class="img2" src="@/assets/img/section3_2.png" />
      <div class="info2" :class="{ animate: isVisibleText2 }">
        <div class="title">모든 정보를 한 화면에</div>
        <div class="description">
          <p>리스트와 사이드바 조합으로, 클릭만으로 필요한 정보를 모두 확인할 수 있습니다.</p>
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
  }
}
.container1 {
  height: 45vh;
  position: absolute;
  top: -45vh;
  right: 60px;

  &.animate {
    top: 65px;
  }
  & img{
    height: 100%;
  }
  & .info1 {
    position: absolute;
    top: 25%;
    right: 110%;
    color: white;
    width: fit-content;
    white-space: nowrap;
    opacity: 0;

    & .title {
      font-size: 2em;
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
}

.container2 {
  height: 55vh;
  position: absolute;
  left: 5vw;
  bottom: 8vh;
  opacity: 0;

  &.animate {
    opacity: 1;
  }
  & img{
    height: 100%;
  }

  & .info2 {
    position: absolute;
    bottom: 20%;
    left: 105%;
    color: white;
    opacity: 0;
    width: fit-content;
    white-space: nowrap;

    & .title {
      font-size: 2em;
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
}
</style>
