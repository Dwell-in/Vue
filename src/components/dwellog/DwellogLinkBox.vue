<script setup>
import md from '@/assets/data/md.json'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const list = ref()
const listOn = ref(true)

const setList = () => {
  list.value = md.data[route.params.categoryId].data
}

const selectUrl = (index) => {
  router.push({ name: 'DwellogDetail', params: { categoryId: route.params.categoryId, link: index } })
}

onMounted(() => setList())

watch(
  () => route.params.categoryId,
  () => setList(),
)
</script>

<template>
  <div class="list">
    <div class="title">
      {{ md.data[route.params.categoryId].category }}
      <div class="sub-title">
        {{ md.data[route.params.categoryId].subTitle }}
      </div>
    </div>
    <ul v-if="listOn">
      <li v-for="(item, index) in list" :key="index" @click="selectUrl(index)"
        :class="{ active: route.params.link == index }">
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
</template>


<style lang="scss" scoped>
.list {
  width: 1200px;
  margin: 100px auto;
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 20px;
}

.title {
  font-size: 1.3em;
  font-weight: bold;
  line-height: 2em;
  margin-bottom: 30px;

  & .sub-title{
    margin-top: -10px;
    color: #3C90E2;
  }
}

ul {
  width: 100%;
  list-style: decimal;
  line-height: 2em;
  padding-left: 20px;
}

li {
  padding-left: -20px;
  color: #5e646a;
  cursor: pointer;
}

.toggleBtn {
  display: inline-block;
  cursor: pointer;
  margin: 20px 0;
}

.active {
  color: #12B886;
  font-weight: bold;
}
</style>
