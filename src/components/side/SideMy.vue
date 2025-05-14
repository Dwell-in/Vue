<script setup>
import api from '@/lib/api'
import { onMounted, reactive } from 'vue'
import SideDefault from '@/components/side/SideDefault.vue'
import { useSideStore } from '@/stores/side'

const store = useSideStore()

const loginUser = reactive({
  name: '',
  profileImg: '',
})

// 로그인 유저 얻어오기
const getLoginUser = async () => {
  const res = await api.get(`/api/v1/member/user-info`)
  const resUser = res.data.data
  loginUser.name = resUser.name
  loginUser.profileImg = resUser.profileImg
}
onMounted(async () => {
  await getLoginUser()
})

// 로그아웃
const logout = async () => {
  await api.get('/api/v1/member/logout')
  loginUser.value = null
}
</script>

<template>
  <SideDefault class="myView" @close="store.myToggle(false)">
    <div class="my-header">
      <span> {{ loginUser.name }} </span>
      <img class="profile" :src="loginUser.profileImg" alt="" @click="logout" />
    </div>
    <div class="my"></div>
  </SideDefault>
</template>

<style scoped>
.myView {
  padding: 0 1vh;
  gap: 0;
  flex-direction: row;
  flex-wrap: wrap;
}
.my-header {
  width: 100%;
  height: 25%;
  color: white;
  display: flex;
  align-items: center;
  font-size: 2em;
  position: relative;
}
.my-header span {
  margin: 0 2%;
  font-size: 1em;
}
.profile {
  height: 45%;
  border-radius: 50%;
  position: absolute;
  bottom: -15%;
  right: 10%;
  border: 5px solid #4ab5e6;
}
.my {
  width: 100%;
  min-height: 100%;
  background-color: white;
  border-radius: 20px;
}
</style>
