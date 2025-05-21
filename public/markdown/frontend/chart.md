> Chart.js는 canvas 태그를 이용해 그래프를 그리는 라이브러리입니다.

---

## 화면 예시

---

## 구현 방법

### 1. Vue3에서 사용하기 위한 의존성을 설치합니다.

> npm install chart.js

---

### 2. Chart 객체 준비

```js
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
```

- 차트를 그릴 때 필요한 모든 요소(컴포넌트)를 전역으로 등록하는 코드입니다.

---

### 3. 사용 문법

```vue
<script setup>
~~

const chart = new Chart(chartId.value, {
    type: ~~,
    data: ~~,
    options: ~~
})
</script>

<template>
  <canvas :id="chartId" height="280" width="280"></canvas>
</template>
```

- chart 객체는 id, type, data, options를 정의하여 초기화합니다.
- canvas 태그에 그래프가 그려집니다.

---

### 4. type

```js
type: props.chartType,
```

- 그래프의 형태를 작성합니다.
- 문자열 형태로 작성하며, 'bar', 'line', 'doughnut'등이 있습니다.

---

### 5. data

```js
const labels = props.list.map((deal) => `${deal.dealYear}-${String(deal.dealMonth).padStart(2, '0')}`)
const amounts = props.list.map((deal) => parseFloat(deal.amount.replace(/,/g, '')))

~~~

data: {
 	labels: labels,
    datasets: [
      {
        label: '거래가격 (만원)',
        data: amounts,
      },
    ],
},
```

- 차트에 표시될 데이터를 작성합니다.
- labels : x축에 표시될 데이터입니다.
- label : 데이터 설명 텍스트로 사용되면 툴팁에 표시됩니다.
- data : 그래프에 그려질 데이터(배열 등)입니다.

---

### 6. options

```js
options: {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: '거래가격 변화',
      font: {
        size: 20
      }
    },
    legend: {
      display: false,
      labels: {
        color: 'white'
      }
    },
    tooltip: {
      bodyFont: {
        size: 14
      },
      padding: 6,
      backgroundColor: 'rgba(0,0,0,0.7)',
      titleFont: {
        size: 14
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: 'white'
      }
    },
    y: {
      ticks: {
        color: 'white',
        callback: (value) => value
      }
    }
  }
}

```

| 옵션 경로                        | 설명                                  | 예시                                     |
| -------------------------------- | ------------------------------------- | ---------------------------------------- |
| `responsive`                     | 반응형 여부 (화면 크기 따라 리사이즈) | `true` / `false`                         |
| `maintainAspectRatio`            | 종횡비 유지 여부                      | `true` / `false`                         |
| `plugins.title.display`          | 제목 표시 여부                        | `true` / `false`                         |
| `plugins.title.text`             | 차트 제목 내용                        | `"거래가격 변화"`                        |
| `plugins.title.font.size`        | 제목 폰트 크기                        | `16`, `20` 등                            |
| `plugins.legend.display`         | 범례(legend) 표시 여부                | `true` / `false`                         |
| `plugins.legend.labels.color`    | 범례 텍스트 색상                      | `"white"` 등                             |
| `plugins.tooltip.enabled`        | 툴팁 표시 여부                        | `true` / `false`                         |
| `plugins.tooltip.bodyFont.size`  | 툴팁 본문 폰트 크기                   | `14` 등                                  |
| `plugins.tooltip.titleFont.size` | 툴팁 타이틀 폰트 크기                 | `14` 등                                  |
| `plugins.tooltip.padding`        | 툴팁 안쪽 여백                        | `6` 등                                   |
| `scales.x.ticks.color`           | X축 눈금 색상                         | `"white"` 등                             |
| `scales.y.ticks.color`           | Y축 눈금 색상                         | `"white"` 등                             |
| `scales.y.ticks.callback`        | Y축 눈금 포맷 함수                    | `(value) => value + '만원'`              |
| `layout.padding`                 | 차트 전체 패딩                        | `10` 또는 `{ top: 10, bottom: 10, ... }` |

---

### 7. Chart 컴포넌트의 재사용

```js
const props = defineProps({
  list: Object,
  chartType: {
    type: String,
    default: 'line',
  },
  fontSize: {
    type: Number,
    default: 14,
  },
})
```

- 필요한 로직을 Chart 컴포넌트에서 모두 작성하고 부모 컴포넌트는 props만 작성하여 사용합니다.
