<template>
  <div class="admin-container">
    <aside class="sidebar">
      <ul>
        <li
          v-for="(item, index) in menu"
          :key="index"
          @click="active = item"
          :class="{ active: active.label === item.label }"
        >
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
import MemberManage from '@/components/admincomponent/MemberManage.vue'

const menu = [
  { label: 'EC2 모니터링', component: markRaw(MetricsDashboard) },
  { label: '회원 관리', component: markRaw(MemberManage) }
]

const active = ref(menu[0])
</script>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #f8f8f8;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin-top: 100px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.sidebar li:hover {
  background-color: #eee;
}

.sidebar li.active {
  font-weight: bold;
  background-color: #ddd;
}

.content {
  flex: 1;
  padding: 24px;
  background-color: #fff;
}
</style>
