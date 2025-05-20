<script setup>
import BaseNav from '@/components/board/BaseNav.vue'
import MarkDown from '@/components/board/MarkDown.vue'
import Footer from '@/components/footer/Footer1.vue'
import Header from '@/components/header/Header.vue'
import md from '@/assets/data/md.json'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const titles = ['BackEnd', 'Vue3', 'JS', 'CSS']
const route = useRoute()

const url = ref()
const list = ref()
const listOn = ref(true)

const selectUrl = (link) => {
  url.value = md.baseURL + md.data[route.params.categoryId].middleURL + link
}

const setList = () => {
  list.value = md.data[route.params.categoryId].data
}

onMounted(() => setList())

watch(
  () => route.params.categoryId,
  () => setList(),
)
</script>

<template>
  <Header></Header>
  <BaseNav :titles="titles" />
  <div class="list">
    <div class="title">
      {{ md.data[route.params.categoryId].category }}
    </div>
    <ul v-if="listOn">
      <li v-for="(item, index) in list" :key="index" @click="selectUrl(item.link)">
        {{ item.title }}
      </li>
    </ul>
    <div class="toggleBtn" v-if="listOn" @click="listOn = false">
      <i class="fa-solid fa-caret-up"></i>&ensp;숨기기
    </div>
    <div class="toggleBtn" v-else @click="listOn = true">
      <i class="fa-solid fa-caret-down"></i>&ensp;목록보기
    </div>
  </div>
  <main>
    <MarkDown v-if="url" :url="url"></MarkDown>
  </main>
  <Footer></Footer>
</template>

<style lang="scss" scoped>
main {
  width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 65px - 210px - 150px);
}

.list {
  width: 1200px;
  margin: 100px auto;
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 10px;

  & .title {
    font-size: 1.3em;
    font-weight: bold;
    line-height: 2em;
    margin-bottom: 30px;
  }

  & ul {
    width: 100%;
    list-style: decimal;
    line-height: 2em;
    padding-left: 20px;
  }

  & li {
    padding-left: -20px;
    color: #5e646a;
    cursor: pointer;
  }

  & .toggleBtn {
    cursor: pointer;
    margin: 20px 0;
  }
}
</style>
