<script setup>
import { onMounted, ref, watch } from 'vue';
import ModalBase from './ModalBase.vue';
import api from '@/lib/api';
import { useModalStore } from '@/stores/modal';
import DetailChart from '../detail/DetailChart.vue';
import DetailNews from '../detail/DetailNews.vue';
import DetailRoadView from '../detail/DetailRoadView.vue';
import { useSideStore } from '@/stores/side';

const sideStore = useSideStore()

const modalStore = useModalStore()
const close = () => {
  modalStore.detailToggle(false)
}
const fullClose = () => {
  modalStore.detailToggle(false)
  sideStore.detailToggle(true)
}


// TODO getInfo() 선택한 아파트로 변경하기
const info = ref(null)
const getInfo = async () => {
  if (modalStore.aptSeq == null) return
  const res = await api.get(`/api/v1/house/${modalStore.aptSeq}`)
  console.log(res.data.data)
  return res.data.data
}
const setInfo = async() => {
  info.value = await getInfo()
}
onMounted(async () => {
  await setInfo()
})
watch(() => modalStore.aptSeq, async () => await setInfo())

const searchCategory = ref('blog')
const changeSearchCategory = (category)=>{
  searchCategory.value = category
}

</script>

<template>
  <ModalBase @close="close">
    <template #header>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="35px" fill="#a7a7a7">
        <path
        d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
      </svg>
      <div class="title">{{info?.aptNm}}</div>
      <svg class="side" @click="fullClose" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"/></svg>
    </template>
    <template #main>
      <div class="grid-chart-title title">CHART</div>
      <div class="grid-chat-title title">CHAT</div>
      <div class="grid-road-view-title title">ROAD VIEW</div>
      <div class="grid-info-title title">INFO</div>
      <div class="grid-blog-title">
        <div class="title" :class="{active: searchCategory=='blog'}" @click="changeSearchCategory('blog')">BLOG</div>
        <div class="title" :class="{active: searchCategory=='news'}" @click="changeSearchCategory('news')">NEWS</div>
      </div>
      <div class="grid-info">
        <table>
          <tr>
            <td>건물명</td>
            <td>{{ info?.aptNm }}</td>
          </tr>
          <tr>
            <td>주소</td>
            <td>
              {{ info?.roadNm }}
              <template v-if="info?.roadNmBonbun !== '0'">{{ info?.roadNmBonbun }}</template>
              <template v-if="info?.roadNmBubun !== '0'">-{{ info?.roadNmBubun }}</template>
            </td>
          </tr>
          <tr>
            <td>건축년도</td>
            <td>{{ info?.buildYear }}</td>
          </tr>
        </table>
      </div>
      <div class="grid-chat"></div>
      <DetailRoadView v-if="info" :info="info" class="grid-road-view"></DetailRoadView>
      <DetailChart v-if="info" :info="info" class="grid-chart" :fontSize="40" :chartType="'doughnut'"></DetailChart>
      <DetailNews v-if="info" :info="info" class="grid-blog" :searchCategory="searchCategory"></DetailNews>
    </template>
  </ModalBase>
</template>

<style scoped>
:deep(.main){
  display: grid;
  grid-template-areas:
  "infoTitle chartTitle .    roadViewTitle"
  "info      chart      .    road         "
  "chatTitle blogTitle  .    road         "
  "chat      blog       blog blog         ";
  grid-template-columns: 3.5fr 3fr 0.5fr 4fr;
  grid-template-rows: 1fr 4fr 1fr 4fr;
  color: white;
}
:deep(.main) > *:not(.grid-chart){
  width: 100% !important;
  height: 100% !important;
  padding: 2vh 0;
}
.grid-chart-title { grid-area: chartTitle; }
.grid-chat-title { grid-area: chatTitle; }
.grid-road-view-title { grid-area: roadViewTitle; }
.grid-info-title { grid-area: infoTitle; }
.grid-blog-title { grid-area: blogTitle; }

.grid-chart { grid-area: chart; }
.grid-chat { grid-area: chat; }
.grid-road-view { grid-area: road; }
.grid-info { grid-area: info; }
.grid-blog { grid-area: blog;}



.title{
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  font-weight: bold;
}
.title *{
  font-size: 1.5rem;
}

.grid-info{
  line-height: 1.5em;
}
.grid-info table{
  border-collapse: collapse;
  width: 80%;
}
.grid-info td{
  padding: 10px;
}

.grid-info td+td{
  border-left: 1px solid white;
  width: 75%;
}
.grid-info tr+tr{
  border-top: 1px solid white;
}
.grid-road-view {
  background: none !important;
}
.grid-road-view > *{
  position: relative !important;
  border-radius: 20px;
}

.grid-blog-title{
  display: flex;
  gap: 2vh;
}
.grid-blog-title .title{
  cursor: pointer;
}
.grid-blog-title .title.active{
  background-color: #3B3B3B;
  border-radius: 10px;
  padding: 5px 10px;
}

.grid-blog {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 3vh;
  overflow-y: hidden;
  flex-shrink: 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.grid-blog:-webkit-scrollbar {
  display: none;
}

.grid-blog > :deep(a) {
  flex-shrink: 0;
  height: 100%;
  aspect-ratio: 1;
  position: relative;
  border-radius: 2vh;
  overflow: hidden;
  color: white;
}

.grid-blog :deep(img) {
  width: 100%;
  height: 100%;
}

.grid-blog :deep(.title) {
  width: 100%;
  height: 40%;
  position: absolute;
  bottom: 0;
  background-color: #000000c2;
  font-size: 0.7em;
  padding: 10px 5px;
}

.grid-blog .title b {
  font-size: 1em;
}

body:not(:has(.map)) .side{
  display: none;
}
.side{
  position: absolute;
  right: 0;
  width: 3vh;
  cursor: pointer;
}
</style>
