<template>
  <Header />
  <main>
    <div>
      <h2>관심지역 페이지 입니다</h2>
      <PostStarredList />
    </div>
    <div class="chatbot-wrapper">
      <AiChatbot />
    </div>
  </main>

  <Footer />
</template>

<script setup>
import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer1.vue'
import PostStarredList from '@/components/starred/PostStarredList.vue'
import AiChatbot from '@/components/ai/ChatbotAi.vue'
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
.chatbot-wrapper {
  flex: 1;
  background-color: #1e1e1e;
  border-radius: 12px;
  height: 600px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  color: white;
  min-width: 300px;
}
</style>
