<script setup>
import { ref } from 'vue'
import Search from './Search.vue'
import Menu from './Menu.vue'
import Member from './Member.vue'

const props = defineProps({
  isMainHeader: Boolean,
})

const hovered = ref(false)
</script>

<template>
  <header
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    :class="{ mainHeader: props.isMainHeader }"
  >
    <nav>
      <Menu :hovered="hovered" />
      <div>
        <Search :hovered="hovered" />
        <Member />
      </div>
    </nav>
  </header>
</template>

<style scoped>
header {
  width: 100vw;
  height: 65px;
  background-color: white;
  box-shadow: 0 2px 10px #52616b;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
nav {
  width: 100%;
  height: 65px;
  padding: 0 40px;
  margin: 0 auto;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
nav * {
  color: #52616b;
}
nav div {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 30px;
}

.mainHeader {
  background-color: #ffffff10;
}
.mainHeader :deep(a) {
  color: white;
}
</style>
