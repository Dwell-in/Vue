<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/api'

const router = useRouter()
const handleSubmit = () => {
  router.push({ name: 'Map', params: { address: inputValue.value } })
}

defineExpose({
  handleSubmit,
})

let sido = ''
let gugun = ''
let dong = ''
let selectedSido = ''
let selectedGugun = ''
const filtered = ref()
const inputElement = ref()
const inputValue = ref('')
const listElement = ref()

const sido_update = () =>
  api.get(`/api/v1/search/sido`).then((res) => {
    sido = res.data.data
    filtered.value = sido
  })

const gugun_update = (param) =>
  api.get(`/api/v1/search/gugun/${param}`).then((res) => (gugun = res.data.data))

const dong_update = (param) =>
  api.get(`/api/v1/search/dong/${param[0]}/${param[1]}`).then((res) => (dong = res.data.data))

const filtering = (word) => {
  if (inputValue.value.split(' ').length == 3) {
    if (inputValue.value.endsWith(' ')) {
      filtered.value = dong.map((d) => selectedGugun + ' ' + d)
    } else {
      filtered.value = dong
        .filter((d) => d.includes(word.trim().split(' ').pop()))
        .map((d) => selectedGugun + ' ' + d)
    }
  } else if (inputValue.value.split(' ').length == 2) {
    if (inputValue.value.endsWith(' ')) {
      filtered.value = gugun.map((g) => selectedSido + ' ' + g)
    } else {
      filtered.value = gugun
        .filter((g) => g.includes(word.trim().split(' ').pop()))
        .map((g) => selectedSido + ' ' + g)
    }
  } else {
    filtered.value = sido.filter((s) => s.includes(word))
  }
}

// 자동완성 목록 표시
const autocompleteOn = () => {
  listElement.value.style.display = 'block' // 자동완성 목록 표시
}

// 자동완성 클릭 이벤트에 들어갈 함수
const autocomplete = async (addr) => {
  inputValue.value = addr + ' ' // 클릭한 항목을 input에 표시
  if (addr.split(' ').length == 2) {
    selectedGugun = addr
    await dong_update(addr.split(' '))
  } else if (addr.split(' ').length == 1) {
    selectedSido = addr
    await gugun_update(addr)
  }

  filtering(addr)
  setTimeout(() => {
    autocompleteOn()
    inputElement.value.focus()
  }, 200)
}

// 'input' 이벤트 리스너 (자동완성)
const handleInput = (e) => {
  inputValue.value = e.target.value
  filtering(inputValue.value)
}

// 스페이스바, 엔터 입력으로 자동 완성
const handleKeypress = (e) => {
  if (e.key === ' ' || (inputValue.value.split(' ').length <= 3 && e.key === 'Enter')) {
    listElement.value.firstElementChild.click()
    setTimeout(() => {
      autocompleteOn()
    }, 200)
  }
}

const handleFocusout = () => {
  setTimeout(() => {
    listElement.value.style.display = 'none' // 포커스 아웃 후 목록 숨기기
  }, 200)
}

onMounted(() => {
  sido_update()
})
</script>

<template>
  <input
    class="search-input"
    type="text"
    name="word"
    autocomplete="off"
    ref="inputElement"
    v-model="inputValue"
    @input="handleInput"
    @keypress.prevent="handleKeypress"
    @focus="autocompleteOn"
    @focusout="handleFocusout"
  />
  <ul class="autocomplete-list" ref="listElement">
    <li v-for="item in filtered" :key="item" @click="autocomplete(item)">
      {{ item }}
    </li>
  </ul>
</template>

<style scoped>
.autocomplete-list {
  position: absolute;
  width: 100%;
  top: 100%;
  left: 0;
  display: none;
  background-color: #00000070;
  border: 1px solid #52616b70;
  border-radius: 20px;
  max-height: 250px;
  z-index: 100;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.autocomplete-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.autocomplete-list li {
  color: white;
  padding: 10px 20px;
  font-weight: 400;
  font-size: 0.8em;
  cursor: pointer;
}

.autocomplete-list li:hover {
  background-color: #00000080;
}
</style>
