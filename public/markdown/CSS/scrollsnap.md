## 화면 예시

![](https://velog.velcdn.com/images/ksj0314/post/def71d4f-ea44-4312-a607-fccfa221ec3e/image.gif)

---

## 구현 방법

```css
.container {
  scroll-behavior: smooth; /* 스크롤 부드럽게 */
  scroll-snap-type: x mandatory;
  & > * {
    scroll-snap-align: start;
  }
}
```

#### scroll-snap-type

: 이 속성은 **부모 요소(container)**에 설정하며, 스크롤 스냅의 방향과 동작 방식을 지정합니다.

- x / y / block / inline / both: 스냅 방향을 설정합니다.
  x: 수평 스냅
  y: 수직 스냅
  both: 수평과 수직 둘 다 스냅 적용

- mandatory / proximity
  mandatory: 반드시 스냅 지점에 맞춰 스크롤됨 (강제)
  proximity: 가까이 있을 때만 스냅되고, 멀면 무시 (유연)

#### scroll-snap-align

: 이 속성은 **자식 요소(item)**에 설정하며, 부모 요소의 스냅 지점에 자식 요소가 어떻게 정렬될지를 지정합니다.

start: 요소의 시작 부분이 컨테이너의 스냅 포인트에 맞춰짐 (왼쪽/위쪽)
center: 요소의 중앙이 맞춰짐
end: 요소의 끝 부분이 맞춰짐
none: 스냅 무효화
