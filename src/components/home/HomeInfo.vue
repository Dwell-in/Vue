<script setup>
import { ref, onMounted } from 'vue'

// 부모로부터 전달된 moveSection 함수 받아오기
const props = defineProps({
  moveSection: Function,
})

// 타이핑 애니메이션
const title = ref('')
const titleSub = ref(null)
const content = ref(null)
const moveSectionIcon = ref(null)

const infoChild = [titleSub, content, moveSectionIcon]

onMounted(() => {
  const text = 'Dwell-In'
  let currentIndex = 0

  const intervalId = setInterval(() => {
    if (currentIndex <= text.length) {
      title.value = text.substring(0, currentIndex)
      currentIndex++
    } else {
      clearInterval(intervalId)
      setTimeout(() => {
        infoChild.forEach((child) => {
          child.value.style.opacity = '1'
        })
      }, 300)
    }
  }, 150)
})
</script>

<template>
  <section>
    <div class="title-sub" ref="titleSub">부제</div>
    <div class="title">{{ title }}</div>
    <div class="content" ref="content">멘트멘트멘트멘트멘트멘트멘트멘트</div>
    <div class="moveSectionIcon" ref="moveSectionIcon">
      <img
        src="@/assets/img/moveSectionIcon.png"
        alt="moveSectionIcon"
        @click="props.moveSection"
      />
      <p>마우스 휠 이동이 가능합니다.</p>
    </div>
  </section>
</template>

<style scoped>
section {
  background: url(@/assets/img/index.png) top / cover no-repeat;
}
section {
  padding-top: 300px;
  padding-left: 300px;
  color: white;
  position: relative;
}
.title-sub {
  opacity: 0;
  transition: 1s;
}
.title {
  font-weight: bold;
  font-size: 2.5em;
}
.content {
  margin-top: 50px;
  font-size: 1.5em;
  opacity: 0;
  transition: 1s;
}
.moveSectionIcon {
  cursor: pointer;
  width: 300px;
  position: absolute;
  right: 80px;
  bottom: 50px;
  opacity: 0;
  transition: 1s;
  display: flex;
  flex-direction: column;
  align-items: end;
}
.moveSectionIcon img {
  width: 45px;
}
.moveSectionIcon p {
  font-size: 0.6em;
  line-height: 3em;
  text-align: end;
}
</style>
