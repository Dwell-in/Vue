# 주소 자동 완성 검색

> Vue 3의 `<script setup>` 구문과 REST API 통신을 활용하여 구현한 **주소 자동완성 기능**의 전체 흐름과 코드를 설명합니다.
> 사용자는 텍스트 입력과 리스트 클릭을 통해 주소를 단계적으로 선택할 수 있으며, 각 단계에 따라 시/도, 구/군, 동 정보를 자동으로 불러옵니다.

---

## 화면 예시

|                                            시/도 검색                                            |                                            구/군 검색                                            |
| :----------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
| ![](https://velog.velcdn.com/images/ksj0314/post/2f982f2e-6229-443b-a8fc-cf4d55b05583/image.png) | ![](https://velog.velcdn.com/images/ksj0314/post/ff3d35ba-13d8-48bd-b75c-b91485d3af14/image.png) |

---

## 주요 기능 요약

- 사용자가 입력한 텍스트를 기준으로 **시/도 → 구/군 → 동**의 계층적 주소 데이터를 자동 필터링하여 보여줍니다.
- 선택된 주소는 `input` 창에 채워지며, 다음 단계의 자동완성 데이터를 API로 요청합니다.
- 엔터 또는 스페이스 입력 시 자동완성 리스트에서 첫 번째 항목이 자동 선택됩니다.

---

## 구현 방법

### 1. 데이터 흐름 구조

```plaintext
시도(sido) → 구군(gugun) → 동(dong)
```

각 주소 데이터는 `PathVariable` 방식으로 서버에서 API를 통해 받아옵니다.

- `/api/v1/search/sido`
- `/api/v1/search/gugun/{sido}`
- `/api/v1/search/dong/{sido}/{gugun}`

---

### 2. 주요 변수 및 상태 관리

```js
const inputValue = ref('') // input창의 현재 값
const filtered = ref() // 자동완성 목록 데이터
const inputElement = ref() // input DOM 참조
const listElement = ref() // 자동완성 리스트 DOM 참조
```

선택된 주소 상태:

```js
let selectedSido = ''
let selectedGugun = ''
```

---

### 3. API 통신 함수 정의

```js
const sido_update = () => api.get(`/api/v1/search/sido`).then(...)
const gugun_update = (param) => api.get(`/api/v1/search/gugun/${param}`)
const dong_update = (param) => api.get(`/api/v1/search/dong/${param[0]}/${param[1]}`)
```

- Vue 컴포넌트가 마운트되면 `sido_update()`를 호출하여 시/도 목록을 먼저 불러옵니다.

---

### 4. 자동완성 필터링 로직

```js
const filtering = (word) => {
  if (단어 3개) → 동 필터링
  else if (단어 2개) → 구/군 필터링
  else → 시/도 필터링
}
```

- 사용자가 입력한 값의 단어 개수에 따라 필터링 대상이 달라집니다
- 각 단계에서 마지막 단어에 포함된 글자를 기준으로 `includes()` 필터링을 수행합니다.

---

### 5. 자동완성 UI 제어

```js
const autocompleteOn = () => {
  listElement.value.style.display = 'block'
}

const handleFocusout = () => {
  setTimeout(() => {
    listElement.value.style.display = 'none'
  }, 200)
}
```

- `focus` 이벤트에서 리스트를 표시하고
- `focusout` 이벤트에서 리스트를 200ms 뒤 숨깁니다.
- `<li>` 항목을 클릭하여 선택했을 때, `inputElement.value.focus()`를 이용하여 list가 사라지는 것을 방지합니다.

---

### 6. 자동완성 리스트 항목 클릭 처리

```js
const autocomplete = async (addr) => {
  inputValue.value = addr + ' '
  조건 분기: 시/도 선택 or 구/군 선택 → 다음 단계 API 호출
  filtering(addr)
  포커스 유지
}
```

- 선택 항목은 공백 포함하여 `inputValue`에 반영되며 다음 주소 데이터를 불러옵니다.

---

### 7. 키보드 이벤트 처리

```js
const handleKeypress = (e) => {
  if (스페이스 또는 엔터) {
    e.preventDefault()
    첫 번째 리스트 항목 click()
  }
}
```

- 엔터 혹은 스페이스 입력으로 리스트 첫 항목을 자동 선택하여 사용자 편의성을 높입니다.
