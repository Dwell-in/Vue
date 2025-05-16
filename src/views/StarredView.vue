<template>
  <Header />
  <main>
    <div>
      <h2>관심지역 페이지 입니다</h2>
      <PostStarredList />
    </div>
  </main>

  <Footer />
</template>

<script setup>
import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer1.vue'
import PostStarredList from '@/components/starred/PostStarredList.vue'
</script>

<style scoped>
main {
  max-width: 1920px;
  min-height: calc(100vh - 215px);
  margin-top: 65px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
