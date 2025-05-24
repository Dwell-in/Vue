## Search API 명세서

Base URL: `/api/v1/search`

---

### 시도 목록 조회

- URL: `/sido`
- Method: `GET`
- 설명: 모든 시도 이름 목록을 조회합니다.

#### Response

```json
{
  "status": "SUCCESS",
  "data": ["서울특별시", "경기도", "부산광역시"]
}
```

---

### 구군 목록 조회

- URL: `/gugun/{sido}`
- Method: `GET`
- 설명: 해당 시도에 속한 구군 목록을 조회합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| sido | String | 시도 이름 |

#### Response

```json
{
  "status": "SUCCESS",
  "data": ["강남구", "서초구", "송파구"]
}
```

---

### 동 목록 조회

- URL: `/dong/{sido}/{gugun}`
- Method: `GET`
- 설명: 해당 시도와 구군에 속한 동 목록을 조회합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| sido | String | 시도 이름 |
| gugun | String | 구군 이름 |

#### Response

```json
{
  "status": "SUCCESS",
  "data": ["역삼동", "논현동"]
}
```

---

### OpenGraph 데이터 조회

- URL: `/og`
- Method: `GET`
- 설명: 외부 링크로부터 OpenGraph 메타 정보를 조회합니다.

#### Query Parameter

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| url | String | 대상 URL |

#### Response

```json
{
  "title": "예시 제목",
  "image": "https://example.com/image.jpg",
  "description": "예시 설명"
}
```

---

### 외부 이미지 URL 요청

- URL: `/imgUrl`
- Method: `GET`
- 설명: 외부 이미지 URL을 통해 이미지를 반환합니다 (byte stream).

#### Query Parameter

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| url | String | 이미지 URL |

#### Response

- Content-Type: `image/jpeg`
- Body: 이미지 바이트 스트림

---

### 네이버 검색 API

- URL: `/naver/{category}`
- Method: `GET`
- 설명: 네이버 검색 API를 통해 지정된 카테고리의 데이터를 조회합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| category | String | 검색 카테고리 (e.g. blog, news, etc.) |

#### Query Parameter

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| query | String | O | 검색어 |
| display | Integer | X | 검색 결과 수 |

#### Response

```json
{
  "lastBuildDate": "Fri, 24 May 2024 10:00:00 +0900",
  "total": 100,
  "start": 1,
  "display": 10,
  "items": [
    {
      "title": "검색 결과 제목",
      "link": "https://blog.example.com",
      "description": "내용",
      ...
    }
  ]
}
```