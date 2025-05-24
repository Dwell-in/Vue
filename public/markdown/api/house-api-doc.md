## House API 명세서

Base URL: `/api/v1/house`

---

### 아파트 상세 조회

- URL: `/{aptSeq}`
- Method: `GET`
- 설명: 특정 아파트의 상세 정보를 조회합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| aptSeq | String | 아파트 고유 식별자 |

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": {
    "aptSeq": "11110-100",
    "aptNm": "MID그린(7동)",
    "roadNm": "창신길",
    "roadNmBonbun": "140",
    "roadNmBubun": "10",
    "jibun": "601-8",
    "buildYear": 2002,
    "lat": 37.5775989043871,
    "lon": 127.010034883981,
    "viewCount": 100,
    "sidoName": "서울특별시",
    "gugunName": "종로구",
    "dongName": "창신동",
    "listDeal": []
  }
}
```

---

### 동 기준 아파트 목록 조회

- URL: ``
- Method: `GET`
- 설명: 시도/구군/동 정보로 아파트 목록을 조회합니다.

#### Request (ModelAttribute)

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| sido | String | 시도 |
| gugun | String | 구군 |
| dong | String | 동 |

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": [ ... ]
}
```

---

### 조건 기반 아파트 목록 조회

- URL: `/condition`
- Method: `GET`
- 설명: 아파트 이름, 도로명, 지번 등을 활용한 조건 검색

#### Request (ModelAttribute)

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| sidoName | String | 시도 이름 |
| gugunName | String | 구군 이름 |
| dongName | String | 동 이름 |
| jibun | String | 지번 주소 |
| roadNm | String | 도로명 |
| roadNmBonbun | String | 본번 |
| roadNmBubun | String | 부번 |
| aptNm | String | 아파트 이름 |

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": [ ... ]
}
```

---

### 지도 기준 영역 내 아파트 목록 조회

- URL: `/in-bound`
- Method: `GET`
- 설명: 지도에서 보이는 영역(swLat, swLng, neLat, neLng) 안의 아파트 목록을 조회합니다.

#### Request (Query Parameter)

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| swLat | double | 남서 위도 |
| swLng | double | 남서 경도 |
| neLat | double | 북동 위도 |
| neLng | double | 북동 경도 |

#### Response

```json
{
  "status": "SUCCESS",
  "data": [ ... ]
}
```

---

### 아파트 조회수 증가

- URL: `/view/{aptSeq}`
- Method: `PATCH`
- 설명: 중복 조회 방지를 고려하여 조회수를 증가시킵니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| aptSeq | String | 아파트 ID |

#### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "viewCount": 101
  }
}
```

---

### 관심 아파트 여부 조회

- URL: `/view/starred/{aptSeq}`
- Method: `GET`
- 설명: 사용자가 해당 아파트를 관심 목록에 등록했는지 확인합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| aptSeq | String | 아파트 ID |

#### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "isStarred": true
  }
}
```