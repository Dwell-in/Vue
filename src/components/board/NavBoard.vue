<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const selectedMenu = ref(0)

const selectView = (categoryId) => {
  router.replace({
    name: 'Board',
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
    <div class="title">
      {{
        selectedMenu == 1
          ? '공지사항'
          : selectedMenu == 2
            ? 'FAQ'
            : selectedMenu == 3
              ? '커뮤니티'
              : '1:1 문의'
      }}
    </div>
    <div class="navBtnsDiv">
      <div class="navBtns">
        <div :class="{ selected: selectedMenu == 1 }" @click="selectView(1)">공지사항</div>
        <div :class="{ selected: selectedMenu == 3 }" @click="selectView(3)">커뮤니티</div>
        <div :class="{ selected: selectedMenu == 2 }" @click="selectView(2)">FAQ</div>
        <div :class="{ selected: selectedMenu == 4 }" @click="selectView(4)">1:1 문의</div>
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
}
.title {
  width: 100%;
  height: 73%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.7em;
}
.navBtnsDiv {
  width: 100%;
  height: 27%;
  position: absolute;
  bottom: 0;
  left: 0;
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
.navBtns .selected {
  background-color: #3c90e2;
}
</style>
