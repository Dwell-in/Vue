<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <h2>아파트 검색</h2>

      <input
        v-model="searchInput"
        placeholder="주소 또는 아파트 이름 입력"
        @keyup.enter="search"
        class="input"
      />
      <select v-model="searchType" class="select">
        <option value="jibun">지번주소</option>
        <option value="road">도로명주소</option>
        <option value="aptNm">건물명</option>
      </select>
      <button @click.prevent="search">검색</button>

      <div v-if="results.length">
        <div v-for="item in results" :key="item.aptSeq" class="result" @click="select(item)">
          {{ item.sidoName }} {{ item.gugunName }} {{ item.dongName || '' }} {{ item.jibun }}
          {{ item.aptNm }}
          <br />
          ({{ item.roadNm }} {{ item.roadNmBonbun
          }}<template v-if="item.roadNmBubun && item.roadNmBubun !== '0'"
            >-{{ item.roadNmBubun }}</template
          >)
        </div>
      </div>

      <button @click="$emit('close')">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'

const emit = defineEmits(['selectApt', 'close'])
const props = defineProps({
  condition: String,
})

const searchInput = ref('')
const searchType = ref('jibun')
const results = ref([])

const sidoList = ref([])
const gugunList = ref([])

onMounted(async () => {
  searchInput.value = props.condition

  try {
    const sidoRes = await api.get('/api/v1/search/sido')
    sidoList.value = sidoRes.data.data || []

    const gugunRes = await Promise.all(
      sidoList.value.map((sido) => api.get(`/api/v1/search/gugun/${sido}`)),
    )
    gugunList.value = gugunRes.flatMap((res) => res.data.data || [])
  } catch (e) {
    console.error('시도/구군 목록 로딩 실패', e)
  }
})

const search = async () => {
  const keyword = searchInput.value.trim()
  if (!keyword) return alert('검색어를 입력하세요.')

  const tokens = keyword.split(/\s+/)
  const condition = {}

  if (searchType.value === 'jibun') {
    for (const token of tokens) {
      if (!condition.sidoName && sidoList.value.includes(token)) {
        condition.sidoName = token
      } else if (!condition.gugunName && gugunList.value.includes(token)) {
        condition.gugunName = token
      } else if (
        !condition.dongName &&
        (token.endsWith('동') ||
          token.endsWith('읍') ||
          token.endsWith('면') ||
          token.endsWith('리') ||
          token.endsWith('가') ||
          token.endsWith(')'))
      ) {
        condition.dongName = token
      } else if (!condition.jibun && /^\d/.test(token)) {
        condition.jibun = token
      }
    }
  } else if (searchType.value === 'road') {
    for (const token of tokens) {
      if (!condition.sidoName && sidoList.value.includes(token)) {
        condition.sidoName = token
      } else if (!condition.gugunName && gugunList.value.includes(token)) {
        condition.gugunName = token
      } else if (!condition.roadNm && (token.includes('로') || token.includes('길'))) {
        condition.roadNm = token
      } else if (!condition.roadNmBonbun && /^\d/.test(token)) {
        const [bonbun, bubun] = token.split('-')
        condition.roadNmBonbun = bonbun
        if (bubun) condition.roadNmBubun = bubun
      }
    }
  } else if (searchType.value === 'aptNm') {
    condition.aptNm = keyword
  }

  try {
    const res = await api.get('/api/v1/house/condition', { params: condition })
    results.value = res.data.data || []
  } catch (e) {
    console.error('검색 실패', e)
    alert('검색 중 오류가 발생했습니다.')
  }
}

const select = (apt) => {
  emit('selectApt', apt)
  emit('close')
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.result {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.result:hover {
  background: #eee;
}

.result-list {
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
