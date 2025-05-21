## 화면 예시

| ![](https://velog.velcdn.com/images/ksj0314/post/e98635e2-d763-448f-903d-7ca31daf50f9/image.gif) |
| :----------------------------------------------------------------------------------------------: |

---

## 구현 방법

### Script

```js
const title = ref('')

onMounted(() => {
  const text = 'Dwell-In'
  let currentIndex = 0

  const intervalId = setInterval(() => {
    if (currentIndex <= text.length) {
      title.value = text.substring(0, currentIndex)
      currentIndex++
    } else {
      clearInterval(intervalId)
    }
  }, 150)
})
```

- onMounted()를 이용하여 화면이 렌더링된 후 타이핑 애니메이션이 시작됩니다.
- setInterval()로 150ms마다 한글자 씩 늘어나게 설정합니다.
- 전체 글자가 출력되면 clearInterval()으로 종료합니다.
