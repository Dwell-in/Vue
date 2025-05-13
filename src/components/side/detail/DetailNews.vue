<script setup>
import api from '@/lib/api'
import { onMounted, ref, watch } from 'vue'
import { state } from '@/lib/kakao'

let previews = ref([])

// 아파트 이름으로 블로그 검색하기
const searchBlog = async (word) => {
  const res = await api.get(`/api/v1/search/naver/blog?query=${word}`)
  const newPreviews = []
  for (const item of res.data.items) {
    const preview = await appendBlog(item)
    newPreviews.push(preview)
  }
  previews.value = newPreviews
}

// info-news 안에 블로그 미리보기 생성하기
const appendBlog = async (item) => {
  const imgUrl = await getOG2Link(item.link)

  // 서버에서 이미지 받기
  const res = await api.get(`/api/v1/search/imgUrl?url=${encodeURIComponent(imgUrl)}`, {
    responseType: 'blob',
  })
  const blobUrl = URL.createObjectURL(res.data)

  return {
    img: blobUrl,
    link: item.link,
    title: item.title,
  }
}

// url로 og:image 가져오기 (미리보기 이미지)
const getOG2Link = async (link) => {
  const res = await api.get(`/api/v1/search/og?url=${link}`)
  return res.data['og:image']
}

watch(state, async () => searchBlog(state.info.aptNm))
onMounted(async () => searchBlog(state.info.aptNm))
</script>
<template>
  <div class="info-news">
    <a
      v-for="preview in previews"
      :key="preview.link"
      class="item"
      target="_blank"
      :href="preview.link"
    >
      <img :src="preview.img" alt="" />
      <div class="title" v-html="preview.title"></div>
    </a>
  </div>
</template>

<style scoped>
.info-news {
  height: 15vh;
  display: flex;
  gap: 3vh;
  overflow-y: hidden;
  flex-shrink: 0;
  -ms-overflow-style: none;
  /* 인터넷 익스플로러 */
  scrollbar-width: none;
  /* 파이어폭스 */
}

/* ( 크롬, 사파리, 오페라, 엣지 ) 동작 */
.info-news:-webkit-scrollbar {
  display: none;
}

.info-news > a {
  flex-shrink: 0;
  width: 15vh;
  height: 15vh;
  position: relative;
  border-radius: 2vh;
  overflow: hidden;
}

a img {
  width: 100%;
  height: 100%;
}

.info-news .title {
  width: 100%;
  height: 40%;
  position: absolute;
  bottom: 0;
  background-color: #000000c2;
  font-size: 0.7em;
}

.info-news .title b {
  font-size: 1em;
}
</style>
