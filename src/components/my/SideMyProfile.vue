<script setup>
import defaultProfile from '@/assets/img/default_profile.png'
import { useLoginUserStore } from '@/stores/loginUser'
const loginUserStore = useLoginUserStore()
</script>

<template>
  <div class="my-profile">
    <div>
      <img class="profileIcon" :src="loginUserStore.profileImg || defaultProfile" alt="" />
    </div>
    <div>
      <div class="name"> {{ loginUserStore.name }} </div>
      <div class="email"> {{ loginUserStore.email }}</div>
    </div>
  </div>
</template>

<style scoped>
.my-profile{
  background-color: #1D1D1D;
  border: 1px solid #323232;
  height: 10%;
  border-radius: 10px;
  display: flex;
  align-content: center;
  padding: 1vh;
  gap: 1vh;
}
.my-profile > *{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.profileIcon{
  height: 100%;
  border: 1px solid #323232;
  border-radius: 50%;
}
</style>
