## Property API 명세서

Base URL: `/api/v1/property`

---

### 매물 목록 조회

- URL: ``
- Method: `GET`
- 설명: 다양한 조건에 따라 매물 목록을 조회합니다.

#### Request (Query Parameter - PropertySearchCondition)

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| aptSeq | String | 아파트 ID |
| aptName | String | 아파트 이름 |
| type | String | 매매/전세/월세 |
| direction | String | 방향 |
| parkingAvailable | Boolean | 주차 가능 여부 |
| elevator | Boolean | 엘리베이터 여부 |
| immediateMoveIn | Boolean | 즉시 입주 가능 여부 |
| structureType | String | 구조 형태 |
| minNetArea | Double | 최소 전용면적 |
| maxNetArea | Double | 최대 전용면적 |
| minFloor | Integer | 최소 층수 |
| maxFloor | Integer | 최대 층수 |
| minRooms | Integer | 최소 방 개수 |
| minBathrooms | Integer | 최소 욕실 개수 |
| minPrice | Long | 최소 가격 |
| maxPrice | Long | 최대 가격 |
| optionIds | List<Long> | 포함할 옵션 ID 리스트 |
| safetyIds | List<Long> | 포함할 안전시설 ID 리스트 |
| page | int | 페이지 번호 |
| size | int | 페이지 크기 |

#### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "data": [ ... ],
    "totalCount": 100
  }
}
```

---

### 매물 상세 조회

- URL: `/{id}`
- Method: `GET`
- 설명: 특정 매물의 상세 정보를 조회합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| id | Long | 매물 ID |

#### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "data": {
      "id": 1,
      "aptSeq": "11110-100",
      "aptName": "MID그린(7동)",
      "memberId": 10,
      "memberName": "홍길동",
      "title": "신축 아파트 매물",
      ...
      "propertyImg": "data:image/jpeg;base64,..."
    }
  }
}
```

---

### 매물 등록

- URL: ``
- Method: `POST`
- Content-Type: `multipart/form-data`
- 설명: 새 매물을 등록합니다.

#### Request (ModelAttribute)

- `PropertyDTO` 필드들 + `img` (선택)

#### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "id": 1
  }
}
```

---

### 매물 수정

- URL: ``
- Method: `PUT`
- Content-Type: `application/json`
- 설명: 매물 정보를 수정합니다.

#### Request (RequestBody)

```json
{
  "id": 1,
  "title": "수정된 제목",
  "description": "수정된 설명",
  ...
}
```

#### Response

```json
{
  "status": "SUCCESS",
  "data": "updated"
}
```

---

### 매물 삭제

- URL: `/{id}`
- Method: `DELETE`
- 설명: 매물을 삭제합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| id | Long | 삭제할 매물 ID |

#### Response

```json
{
  "status": "SUCCESS",
  "data": "deleted"
}
```