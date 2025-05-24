## Email API 명세서

Base URL: `/api/v1/email`

---

### 이메일 인증 링크 검증

- URL: `/verify`
- Method: `GET`
- 설명: 이메일로 발송된 인증 링크의 토큰을 검증합니다.

#### Query Parameter

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| token | String | 이메일 인증 토큰 |

#### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "email": "user@example.com",
    "success": true,
    "msg": "이메일 인증이 완료되었습니다"
  }
}
```

---

### 회원가입용 이메일 인증 토큰 발송

- URL: `/send-token`
- Method: `POST`
- 설명: 이메일 인증을 위한 링크를 해당 이메일로 전송합니다.

#### Request (Form Parameter)

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| email | String | 수신자 이메일 주소 |

#### Response

```json
{
  "status": "SUCCESS",
  "data": "메일이 전송되었습니다"
}
```

---

### 임시 비밀번호 발급 및 전송

- URL: `/send-password`
- Method: `POST`
- 설명: 입력한 이메일로 임시 비밀번호를 생성하여 전송합니다.

#### Request (Form Parameter)

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| email | String | 사용자 이메일 |

#### Response

```json
{
  "status": "SUCCESS",
  "data": "임시 비밀번호가 발급되었습니다.\n이메일을 확인해주세요."
}
```