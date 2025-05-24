<template>
  <div class="deal-apt-card">
    <img :src="apt.img || defaultImg" alt="아파트 이미지" class="deal-apt-image" />

    <div class="deal-apt-info">
      <div class="deal-apt-title">
        <strong>{{ apt.price }}</strong>
        <span class="deal-apt-name">{{ apt.name }}</span>
      </div>

      <div class="deal-apt-details">
        {{ apt.floor }}층 · {{ apt.area }}m² · 관리비 {{ apt.maintenance }}
      </div>

      <div class="deal-apt-tags">
        {{ apt.tags }}
      </div>

      <div class="deal-apt-badge">
        <span>{{ apt.badge }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import defaultImg from '@/assets/img/loginbg.png'

//defineProp으로 바꿀예정
const apt = {
  img: '',
  price: '매매 1억9500',
  name: '우남1차',
  floor: 4,
  area: 76.71,
  maintenance: '4만',
  tags: '주인거주, 부분수리로 깔끔함, 남향, 주차가능',
  badge: '방주인',
}
</script>

<style scoped>
.deal-apt-card {
  padding: 20px;
  display: flex;
  background-color: white;
  color: black;
  border-radius: 20px;
  height: 10%;
}

.deal-apt-image {
  width: 120px;
  height: 100px;
  padding-right: 20px;
}

.deal-apt-info {
  display: flex;
  flex-direction: column;
}

.deal-apt-title {
  display: flex;
  flex-direction: column;
}

.deal-apt-name {
  font-size: 15px;
  color: #666;
  margin-top: 4px;
}

.deal-apt-tags {
  font-size: 10px;
  color: #777;
  margin-top: 4px;
}

.deal-apt-details {
  font-size: 15px;
  color: #333;
  margin-top: 4px;
}

.deal-apt-badge span {
  display: inline-block;
  font-size: 10px;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 6px;
}
</style>
