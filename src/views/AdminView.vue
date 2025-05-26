<template>
  <div class="admin-container">
    <aside class="sidebar">
      <ul>
        <li v-for="(item, index) in menu" :key="index" @click="active = item">
          {{ item.label }}
        </li>
      </ul>
    </aside>
    <main class="content">
      <component :is="active.component" />
    </main>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import MetricsDashboard from '@/components/admincomponent/MetricsDashboard.vue'

const menu = [{ label: 'EC2 모니터링', component: markRaw(MetricsDashboard) }]
const active = ref(menu[0])
</script>

<style scoped>
.admin-container {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 200px;
  background: #f4f4f4;
  padding: 1rem;
  margin-top: 100px; /* 헤더 높이만큼 여백 확보 */
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  padding: 0.5rem;
  cursor: pointer;
}
.sidebar li:hover {
  background-color: #ddd;
}
.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  margin-top: 65px; /* 헤더 높이만큼 여백 확보 */
}
</style>
