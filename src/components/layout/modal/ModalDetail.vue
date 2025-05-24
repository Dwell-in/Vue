<script setup>
import ModalBase from './ModalBase.vue'
import StarredToggle from '@/components/starred/StarredToggle.vue'
import { useSideStore } from '@/stores/side'
import { useModalStore } from '@/stores/modal'
import { onMounted, ref, watch } from 'vue'
import api from '@/lib/api'
import DetailInfo from './detail/DetailInfo.vue'
import DetailProperty from './detail/DetailProperty.vue'

const sideStore = useSideStore()
const modalStore = useModalStore()
const close = () => {
  modalStore.detailToggle(false)
}
const fullClose = () => {
  modalStore.detailToggle(false)
  sideStore.detailToggle(true)
}

// INFO / 매물 전환
const isInfo = ref(true)

// aptSeq로 아파트 정보 얻어오기
const info = ref(null)
const getInfo = async () => {
  if (modalStore.aptSeq == null) return
  const res = await api.get(`/api/v1/house/${modalStore.aptSeq}`)

  return res.data.data
}
const setInfo = async () => {
  info.value = await getInfo()
}

onMounted(async () => {
  await setInfo()
})
watch(
  () => modalStore.aptSeq,
  async () => await setInfo(),
)
</script>

<template>
  <ModalBase @close="close" class="detail">
    <template #header>
      <StarredToggle v-if="info" :apt="info"></StarredToggle>
      <div class="title">
        {{ info?.aptNm }}
        <div :class="{active: isInfo}" style="margin-left: 50px;" @click="isInfo=true">INFO</div>
        <div :class="{active: !isInfo}" @click="isInfo=false">매물 보기</div>
      </div>
      <svg
        class="side"
        @click="fullClose"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#ffffff"
      >
        <path
          d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"
        />
      </svg>
    </template>
    <template #main>
      <DetailInfo v-show="isInfo" :info="info"/>
      <DetailProperty v-show="!isInfo" :info="info"/>
    </template>
  </ModalBase>
</template>

<style lang="scss" scoped>
.title {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  font-weight: bold;
  gap: 20px;
  cursor: pointer;
}
.title * {
  font-size: 1.5rem;
}
.title .active {
  background-color: #3b3b3b;
  border-radius: 10px;
  padding: 5px 10px;
}
body:not(:has(.map)) .side {
  display: none;
}
.side {
  position: absolute;
  right: 0;
  width: 3vh;
  cursor: pointer;
}
</style>
