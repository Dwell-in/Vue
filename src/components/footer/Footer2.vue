<script setup></script>

<template>
  <footer id="footer">
    <div>
      <ul class="part-list">
        <li><router-link to="#">이용약관</router-link></li>
        <li class="border"></li>
        <li><router-link to="#">개인정보처리방침</router-link></li>
      </ul>
      <div class="footer-desc">Copyright © Dwell-in.</div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  width: 100vw;
  height: 65px;
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
  top: 0;
  left: 0;
  width: 56px;
  height: 40px;
  background: url('../img/footerLogo.png') center center no-repeat;
  background-size: contain;
  content: '';
}
footer > div {
  width: 1500px;
  padding-left: 150px;
  height: 60%;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.part-list {
  list-style: none;
  display: flex;
  align-items: end;
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
