<script setup>
import BaseNav from '@/components/board/BaseNav.vue'
import MarkDown from '@/components/board/MarkDown.vue'
import Footer from '@/components/footer/Footer1.vue'
import Header from '@/components/header/Header.vue'

const titles = ['BackEnd', 'Vue3', 'JS', 'CSS']
</script>

<template>
  <Header></Header>
  <BaseNav :titles="titles" />
  <div class="list">
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
    </ul>
  </div>
  <main>
    <MarkDown :url="'/markdown/SpringBoot/stomp.md'"></MarkDown>
  </main>
  <Footer></Footer>
</template>

<style lang="scss" scoped>
.list {
  width: 1200px;
  margin: 100px auto;
  & ul {
    width: 100%;
    list-style: decimal;
    line-height: 2em;
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 20px;
    padding-left: 40px;
  }

  & li {
    padding-left: -20px;
  }
}

main {
  width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 65px - 210px - 150px);
}
</style>
