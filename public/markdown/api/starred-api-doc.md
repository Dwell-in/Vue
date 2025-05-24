## Starred API 명세서

Base URL: `/api/v1/starred`

---

### 관심 매물 등록

- URL: `/{aptSeq}`
- Method: `POST`
- 설명: 현재 로그인한 사용자가 특정 아파트를 관심 매물로 등록합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| aptSeq | String | 아파트 ID |

#### Response

```json
{
  "status": "SUCCESS",
  "data": "등록성공"
}
```

---

### 관심 매물 목록 조회

- URL: ``
- Method: `GET`
- 설명: 현재 로그인한 사용자의 관심 매물 목록을 조회합니다.

#### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "data": [
      {
        "aptSeq": "11110-100",
        "aptNm": "MID그린(7동)",
        "roadNm": "창신길",
        "buildYear": 2002,
        "lat": 37.5775989043871,
        "lon": 127.010034883981,
        ...
      }
    ]
  }
}
```

---

### 관심 매물 삭제

- URL: `/{aptSeq}`
- Method: `DELETE`
- 설명: 현재 로그인한 사용자의 관심 매물 목록에서 해당 매물을 제거합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| aptSeq | String | 아파트 ID |

#### Response

```json
{
  "status": "SUCCESS",
  "data": "삭제성공"
}
```