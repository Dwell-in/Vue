<template>
  <div class="member-manage-wrapper">
    <!-- 로그인된 유저 -->
    <div class="top-section">
      <div class="top-box">
        <h3>현재 로그인한 회원</h3>
        <div v-if="loggedInMembers.length" class="logged-vertical">
          <div v-for="m in loggedInMembers" :key="m.id" class="logged-user">
            {{ m.name }} ({{ m.email }})
          </div>
        </div>
        <p v-else>로그인한 회원이 없습니다.</p>
      </div>

      <div class="top-box">
        <h3>차단된 회원 (BANNED)</h3>
        <div v-if="bannedMembers.length" class="logged-vertical">
          <div v-for="m in bannedMembers" :key="m.id" class="logged-user">
            {{ m.name }} ({{ m.email }})
          </div>
        </div>
        <p v-else>차단된 회원이 없습니다.</p>
      </div>
    </div>
    <div class="bottom-section">
      <h3>전체 회원 목록</h3>
      <table>
        <thead>
          <tr>
            <th>이메일</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>권한</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in allMembers" :key="m.email">
            <td>{{ m.email }}</td>
            <td>{{ m.name }}</td>
            <td>{{ m.phone }}</td>

            <td>
              <select v-model="m.role" @change="updateRole(m)">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="DEVELOPER">MODERATOR</option>
              </select>
            </td>

            <td>
              <select v-model="m.state" @change="updateState(m)">
                <option value="NORMAL">정상</option>
                <option value="INACTIVE">휴면</option>
                <option value="BANNED">차단</option>
                <option value="DELETED">탈퇴</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button :disabled="page === 1" @click="page--">이전</button>
        <span>Page {{ page }}</span>
        <button :disabled="!hasNext" @click="page++">다음</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/lib/api'

const loggedInMembers = ref([])
const bannedMembers = ref([])
const allMembers = ref([])

const page = ref(1)
const size = 20
const hasNext = ref(false)

const fetchAllMembers = async () => {
  try {
    const res = await api.get('/api/v1/member/members', {
      params: { page: page.value, size }
    })
    const data = res.data.data || []
    allMembers.value = data
    hasNext.value = data.length === size
  } catch (e) {
    console.error('전체 회원 목록 불러오기 실패', e)
  }
}

const fetchLoggedInMembers = async () => {
  try {
    const res = await api.get('/api/v1/member/logged-in')
    loggedInMembers.value = res.data.data || []
  } catch (e) {
    console.error('로그인 회원 불러오기 실패', e)
  }
}

const fetchBannedMembers = async () => {
  try {
    const res = await api.get('/api/v1/member/state/BANNED')
    bannedMembers.value = res.data.data || []
  } catch (e) {
    console.error('차단 회원 불러오기 실패', e)
  }
}
const updateState = async (member) => {
  try {
    await api.post('/api/v1/member/state-change', null, {
      params: {
        email: member.email,
        state: member.state
      }
    })
    await fetchBannedMembers()
  } catch (e) {
    console.error('상태 변경 실패', e)
    alert('상태 변경 중 오류가 발생했습니다.')
  }
}

const updateRole = async (member) => {
  try {
    await api.post('/api/v1/member/role-change', null, {
      params: {
        email: member.email,
        role: member.role
      }
    })
  } catch (e) {
    console.error('권한 변경 실패', e)
    alert('권한 변경 중 오류가 발생했습니다.')
  }
}
onMounted(() => {
  fetchAllMembers()
  fetchLoggedInMembers()
  fetchBannedMembers()
})

watch(page, fetchAllMembers)
</script>


<style scoped>
.member-manage-wrapper {
  background-color: #fff;
  color: #000;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 65px;
}

.top-section {
  display: flex;
  gap: 20px;
}

.top-box {
  flex: 1;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  min-height: 180px; /* 높이 증가 */
  p{
    margin-top: 10px;
  }
}

.logged-vertical {
  display: flex;
  flex-direction: column;
}

.logged-user {
  padding: 6px 0;
  border-bottom: 1px solid #ddd;
  margin-top: 10px;
}

.logged-user:last-child {
  border-bottom: none;
}

.bottom-section {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-top: 12px;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px 10px;
  text-align: left;
}

th {
  background-color: #eee;
}

.pagination {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.pagination button {
  padding: 6px 12px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
