## AI Chat API 명세서

Base URL: `/api/v1/ai`

---

### 간단 생성 요청

- URL: `/simple`
- Method: `POST`
- Content-Type: `application/json`
- 설명: 사용자의 간단한 입력 메시지를 기반으로 AI 응답을 생성합니다.

#### Request (RequestBody)

```json
{
  "message": "강남 아파트의 장점 알려줘"
}
```

#### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "message": "강남 아파트는 학군, 교통, 생활 인프라가 우수합니다."
  }
}
```

---

### 가격 비교 프롬프트 생성 요청

- URL: `/price`
- Method: `POST`
- Content-Type: `application/json`
- 설명: 여러 아파트 정보를 기반으로 AI가 가격 비교 분석 메시지를 생성합니다.

#### Request (RequestBody)

```json
{
  "promptType": "price-compare",
  "aptList": [
    { "aptSeq": "A1001" },
    { "aptSeq": "A1002" }
  ]
}
```

#### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "message": "A1001과 A1002 아파트의 최근 거래 가격을 비교한 결과..."
  }
}
```