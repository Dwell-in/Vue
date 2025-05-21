<script setup>
import api from '@/lib/api'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  info: Object,
  searchCategory: {
    type: String,
    default: 'blog'
  },
})

let previews = ref([])

// 아파트 이름으로 블로그 검색하기
const searchBlog = async () => {
  const res = await api.get(`/api/v1/search/naver/${props.searchCategory}?query=${encodeURIComponent(props.info.aptNm)}`)
  previews.value = []
  res.data.items.forEach(item => {
    appendBlog(item)
  });
}

// info-news 안에 블로그 미리보기 생성하기
const appendBlog = async (item) => {
  try {
    const imgUrl = await getOG2Link(item.link)
    if (!imgUrl || imgUrl.includes('daumcdn.net/thumb/R800x0/?scode=mtistory2')) {
      // imgUrl 없거나, 문제 URL 패턴 감지되면 기본 이미지 사용
      previews.value.push({
        img: '/path/to/default-image.png', // 기본 이미지 경로 (public 폴더 등)
        link: item.link,
        title: item.title,
      })
      return
    }

    // 서버에서 이미지 받기
    const res = await api.get(`/api/v1/search/imgUrl?url=${encodeURIComponent(imgUrl)}`, {
      responseType: 'blob',
    })
    const blobUrl = URL.createObjectURL(res.data)

    previews.value.push({
      img: blobUrl,
      link: item.link,
      title: item.title,
    })

  } catch (e) {
    console.error('이미지 처리 중 에러:', e)
    previews.value.push({
      img: '/path/to/default-image.png',
      link: item.link,
      title: item.title,
    })
  }

}

// url로 og:image 가져오기 (미리보기 이미지)
const getOG2Link = async (link) => {
  const res = await api.get(`/api/v1/search/og?url=${encodeURIComponent(link)}`)
  return res.data['og:image']
}


watch(()=>props.info, async () => searchBlog())
watch(()=>props.searchCategory, async () => searchBlog())
onMounted(async () => searchBlog())
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
