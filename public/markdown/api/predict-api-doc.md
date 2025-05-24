## AI 가격 예측 API 명세서

Base URL: `/api/v1/predict`

---

### 아파트 가격 예측 요청

- URL: `/price`
- Method: `POST`
- Content-Type: `application/json`
- 설명: 특정 아파트의 정보를 기반으로 가격 예측 메시지를 생성합니다.

#### Request (RequestBody)

```json
{
  "aptSeq": "A1001"
}
```

#### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "message": "해당 아파트의 예상 가격은 9억 원입니다."
  }
}
```