<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  width: String,
  height: String,
  gap: String
})


const containerStyle = computed(() => ({
  gap: props.gap,
}))

const container = ref()
const activeIndex = ref(0)

const widthStr = props.width.trim();
const widthInPx = ref()
const childrenLength = ref()

const onWheel = (e) => {
  const gap = window.getComputedStyle(container.value).gap;
  const totalScrollAmount = widthInPx.value + parseFloat(gap)
  childrenLength.value = container.value.children.length;

  container.value.children[activeIndex.value].classList.remove('active')
  if (e.deltaY < 0) {
    if (activeIndex.value > 0) {
      container.value.scrollBy(totalScrollAmount * -1, 0)
      activeIndex.value--
    }
  } else if (e.deltaY > 0) {
    if (activeIndex.value < childrenLength.value - 1) {
      container.value.scrollBy(totalScrollAmount, 0)
      activeIndex.value++
    }
  }
  container.value.children[activeIndex.value].classList.add('active')
}

const init = (container) => {
  const firstEl = container.value.firstElementChild
  const lastEl = container.value.lastElementChild
  lastEl.style.marginRight = '50%'

  const newValue = (0.5)*(container.value.offsetWidth) - widthInPx.value/2;
  firstEl.style.marginLeft = newValue + 'px';

  const children = container.value.children; // 요소 노드들만 포함
  for (let i = 0; i < children.length; i++) {
    const el = children[i]
    // 클래스 추가
    el.classList.add('item')
    // dataset 설정 (data- 속성)
    el.dataset.index = i
    // 인라인 스타일 설정
    el.style.width = props.width
    el.style.height = props.height
  }
  container.value.children[0].classList.add('active')
}

onMounted(() => {
  widthInPx.value = widthStr.endsWith('%') ? (parseFloat(widthStr) / 100) * (container.value.offsetWidth) : parseFloat(widthStr);
  init(container)
})
</script>

<template>
  <div ref="container" class="container" :style="containerStyle" @wheel="onWheel">
    <slot></slot>
  </div>
  <div class="shadow left" :class="{none: activeIndex < 2}"></div>
  <div class="shadow right" :class="{none: activeIndex > childrenLength-3}"></div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
  /* 파이어폭스용 스크롤바 숨김 */
}

.container::-webkit-scrollbar {
  display: none;
  /* 크롬용 스크롤바 숨김 */
}

:deep(.item) {
  flex-shrink: 0;
}

/* 현재 선택된(가운데 있는) 아이템에 확대 효과 */
:deep(.item.active) {
  transform: scale(1.2);
}

.shadow {
  width: 0 !important;
  height: 50%;
  position: absolute;
  box-shadow: 0 0 40px 50px #111111;
  z-index: 10;
  pointer-events: none;
  top: 25%;
}

.shadow.left {
  left: -1%;
}

.shadow.right {
  right: -1%;
}
.none{
  display: none;
}
</style>
