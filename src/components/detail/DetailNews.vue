<script setup>
import api from '@/lib/api'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  info: Object
})

let previews = ref([])

// 아파트 이름으로 블로그 검색하기
const searchBlog = async (word) => {
  const res = await api.get(`/api/v1/search/naver/blog?query=${word}`)
  previews.value = []
  res.data.items.forEach(item => {
    appendBlog(item)
  });
}

// info-news 안에 블로그 미리보기 생성하기
const appendBlog = async (item) => {
  const imgUrl = await getOG2Link(item.link)

  // 서버에서 이미지 받기
  const res = await api.get(`/api/v1/search/imgUrl?url=${encodeURIComponent(imgUrl)}`, {
    responseType: 'blob',
  })
  const blobUrl = URL.createObjectURL(res.data)

  const preview =  {
    img: blobUrl,
    link: item.link,
    title: item.title,
  }

  previews.value.push(preview)
}

// url로 og:image 가져오기 (미리보기 이미지)
const getOG2Link = async (link) => {
  const res = await api.get(`/api/v1/search/og?url=${link}`)
  return res.data['og:image']
}


watch(()=>props.info, async (newInfo) => searchBlog(newInfo.aptNm))
onMounted(async () => searchBlog(props.info.aptNm))
</script>
<template>
  <div>
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
