<script setup>
import BaseNav from '@/components/board/BaseNav.vue'
import MarkDown from '@/components/board/md/MarkDown.vue'
import Footer from '@/components/footer/Footer1.vue'
import Header from '@/components/header/Header.vue'
import DwellogLinkBox from '@/components/board/md/DwellogLinkBox.vue'
import md from '@/assets/data/md.json'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const titles = ['BackEnd', 'FrontEnd']

const url = ref()
const route = useRoute()

const getUrl = () => {
  url.value = md.baseURL + md.data[route.params.categoryId].middleURL + md.data[route.params.categoryId].data[route.params.link].link
}
onMounted(() => getUrl())

watch(
  () => route.params.link,
  () => {
    getUrl()
  },
)
</script>

<template>
  <div class="mdDetail">
    <Header></Header>
    <BaseNav :titles="titles" :name="'Dwellog'" />
    <div class="title">
      <div>
        {{ md.data[route.params.categoryId].data[route.params.link].title }}
      </div>
    </div>
    <DwellogLinkBox></DwellogLinkBox>
    <main>
      <MarkDown v-if="url" :url="url"></MarkDown>
    </main>
    <Footer></Footer>
  </div>
</template>

<style lang="scss" scoped>
.title {
  width: 1200px;
  margin: 100px auto;

  & div{
    font-size: 2em;
    font-weight: bold;
    padding: 10px 20px;
    background-color: #dafacc;
    border-radius: 15px;
    box-shadow: 0 0 10px 10px #dafacc;
    display: inline-block;
  }
}
main {
  width: 1200px;
  margin: 0 auto 300px;
  min-height: calc(100vh - 65px - 210px - 150px);
}
</style>
