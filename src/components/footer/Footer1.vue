<script setup></script>

<template>
  <footer id="footer">
    <div>
      <ul class="part-list">
        <li><router-link to="#">이용약관</router-link></li>
        <li class="border"></li>
        <li><router-link to="#">개인정보처리방침</router-link></li>
      </ul>
      <address>
        본 사이트의 콘텐츠는 저작권법의 보호를 받는 바 무단 전재, 복사, 배포 등을 금합니다.
      </address>
      <div class="footer-desc">Copyright © Dwell-in.</div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 150px;
  background-color: #1e2022;
  display: flex;
  justify-content: center;
  align-items: center;
}
footer * {
  color: white;
}
footer > div::before {
  position: absolute;
  top: 20%;
  left: 0;
  width: 90px;
  height: 70px;
  background: url('@/assets/img/footerLogo.png') center center no-repeat;
  background-size: contain;
  content: '';
}
footer > div {
  width: 1200px;
  height: 100%;
  padding-left: 150px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}
.part-list {
  list-style: none;
  display: flex;
  align-items: end;
  margin-bottom: 10px;
}
.border {
  width: 1px;
  height: 80%;
  margin: 0 10px;
  border-left: 1px solid #52616b;
}
.part-list li:nth-child(3) a {
  color: #3a8abf;
}
footer address {
  font-size: 0.8em;
  color: #52616b;
}
footer .footer-desc {
  font-size: 0.8em;
}
</style>
