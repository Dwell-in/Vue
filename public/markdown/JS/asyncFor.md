# [Vue] 반복문 안에서 비동기 요청시 통신 속도 저하 문제

> API 통신으로 데이터를 받아올 때, 데이터를 받아오고 나서 다음 코드를 실행하기 위해 await를 사용합니다.
> 많은 데이터를 받아오기에는 시간이 많이걸리기 때문에 로직의 타이밍이 중요합니다.

아래 코드는 `previews`에 데이터(이미지)를 담아 이를 이용해 `v-for` 로 렌더링합니다.
`previews`에 데이터를 넣는 타이밍에 따라 렌더링 속도의 차이가 발생합니다.

---

### 1. 모든 통신이 완료된 후 데이터를 한번에 담기

: `newPreviews` 라는 배열을 따로 만들어 모든 통신이 완료된 후 `previews` 에 한번에 담는 방식입니다.

|                                             Network                                              |                                               View                                               |
| :----------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
| ![](https://velog.velcdn.com/images/ksj0314/post/50d0573a-af4a-4dfc-adc0-fb80d5f4e40b/image.png) | ![](https://velog.velcdn.com/images/ksj0314/post/3c52c924-c9af-4f8a-8c1a-310d67c83271/image.gif) |

- 통신 요청 후 이미지가 불러와지면 다음 요청이 발생하는 모습입니다.
- 2500ms 이상의 총 소요시간이 발생합니다.
- 모든 요청이 끝난 후에 렌더링하기 때문에 마커 클릭 후 2500ms가 지나고 `BLOG` 부분이 렌더링 되는 모습입니다.

> code

```jsx
let previews = ref([])
>
// 아파트 이름으로 블로그 검색하기
const searchBlog = async (word) => {
  const res = await api.get(`/api/v1/search/naver/blog?query=${word}`)
  const newPreviews = []
  for (const item of res.data.items) {
    // ✨ appendBlog: 통신이 오래 걸리는 부분
    const preview = await appendBlog(item)
    newPreviews.push(preview)
  }
  previews.value = newPreviews
}
```

---

### 2. 통신 마다 데이터를 `previews` 에 추가하기

|                                             Network                                              |                                               View                                               |
| :----------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
| ![](https://velog.velcdn.com/images/ksj0314/post/816523ea-9cf0-47cc-b4e0-8bc8e1206f4f/image.png) | ![](https://velog.velcdn.com/images/ksj0314/post/8995da8f-3227-460e-bbe1-244e154b7988/image.gif) |

- 여전히 총 2500ms가 소요됩니다.
- 요청 1회 마다 `previews` 에 추가되면서 렌더링이 발생합니다.
- 사용성이 약간은 향상된 모습입니다.

> code

```jsx
let previews = ref([])
>
// 아파트 이름으로 블로그 검색하기
const searchBlog = async (word) => {
    const res = await api.get(`/api/v1/search/naver/blog?query=${word}`)
    previews.value = []
    for (const item of res.data.items) {
        // ✨ appendBlog: 통신이 오래 걸리는 부분
        const preview = await appendBlog(item)
    	previews.value.push(preview)
	}
}
```

---

### 3. 반복문은 await 없이 한번에 실행, 실행하는 함수 안에서 데이터를 반환받을 때 `previews` 에 추가하기

|                                             Network                                              |                                               View                                               |
| :----------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
| ![](https://velog.velcdn.com/images/ksj0314/post/652ce53c-2a8d-4a3f-a179-65edef6a07f5/image.png) | ![](https://velog.velcdn.com/images/ksj0314/post/10ede6b7-b9c3-4c31-a188-f9edfb7f7004/image.gif) |

- 모든 요청이 한번에 실행되고 이미지가 로드됩니다.
- 총 소요시간이 600ms로 확연하게 줄어든 모습입니다.
- 반복 요청이 10회여서 큰 차이가 없어 보이지만 100회가 된다고 가정하면 1,2번 방법은 총 25000ms의 시간이 소요될 것이고 해당 방법은 600ms로 차이가 없을 것입니다.
- 다만, `previews` 에 담기는 순서가 중요한 경우는 주의해야합니다.

> code

```js
let previews = ref([])
>
// 아파트 이름으로 블로그 검색하기
const searchBlog = async (word) => {
  const res = await api.get(`/api/v1/search/naver/blog?query=${word}`)
  previews.value = []
  res.data.items.forEach(item => {
    appendBlog(item)
  });
}
>
// info-news 안에 블로그 미리보기 생성하기
const appendBlog = async (item) => {
  const imgUrl = await getOG2Link(item.link)
>
  // 서버에서 이미지 받기
  const res = await api.get(`/api/v1/search/imgUrl?url=${encodeURIComponent(imgUrl)}`, {
    responseType: 'blob',
  })
  const blobUrl = URL.createObjectURL(res.data)
>
  const preview =  {
    img: blobUrl,
    link: item.link,
    title: item.title,
  }
>
  previews.value.push(preview)
}
```
