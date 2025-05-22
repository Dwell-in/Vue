<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  titles: Object,
  name: String,
})

const route = useRoute()
const router = useRouter()
const selectedMenu = ref(0)

const selectView = (categoryId) => {
  router.push({
    name: props.name,
    params: { categoryId: categoryId },
  })
}

onMounted(() => {
  selectedMenu.value = route.params.categoryId
})

watch(
  () => route.params.categoryId,
  () => {
    selectedMenu.value = route.params.categoryId
  },
)
</script>

<template>
  <nav>
    <div class="title" v-if="titles">{{ props.titles[route.params.categoryId || 0] }}</div>
    <div class="navBtnsDiv" v-if="route.params.categoryId">
      <div class="navBtns">
        <div
          v-for="(title, index) in titles"
          :key="index"
          :class="{ selected: selectedMenu == index }"
          @click="selectView(index)"
        >
          {{ title }}
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  width: 100%;
  height: 210px;
  margin-top: 65px;
  position: relative;
  background: url('@/assets/img/boardNav.png') no-repeat center / cover;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 5px 1px;
}
.title {
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.7em;
}
.navBtnsDiv {
  width: 100%;
  height: 27%;
  flex-shrink: 0;
  background: rgba(25, 42, 59, 0.8);
  display: flex;
  justify-content: center;
}
.navBtns {
  width: 1200px;
  display: flex;
}
.navBtns > div {
  width: 100%;
  height: 100%;
  border-left: 1px solid #4b5766;
  border-right: 1px solid #4b5766;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.navBtns > div + div {
  border-left: none;
}
.selected {
  background-color: #3c90e2;
}
</style>
