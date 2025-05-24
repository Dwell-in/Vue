## Auth API 명세서

Base URL: `/api/v1/auth`

---

### 로그인

- URL: `/login`
- Method: `POST`
- Content-Type: `application/json`
- 설명: 사용자의 이메일/비밀번호를 통해 로그인하고 Access/Refresh 토큰을 발급받습니다.

#### Request (RequestBody)

```json
{
  "email": "user@example.com",
  "password": "1234"
}
```

#### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "accessToken": "JWT_ACCESS_TOKEN"
  }
}
```

- `Set-Cookie` 헤더에 HttpOnly Refresh 토큰 포함

---

### 로그아웃

- URL: `/logout`
- Method: `POST`
- 설명: Refresh 토큰을 무효화하고 로그아웃합니다.

#### Request (Cookie)

- refreshToken: HttpOnly 쿠키로 전달됨

#### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "message": "로그아웃 성공"
  }
}
```

---

### Access Token 갱신

- URL: `/refresh`
- Method: `POST`
- 설명: 유효한 Refresh 토큰으로 Access Token을 갱신합니다.

#### Request (Cookie)

- refreshToken: HttpOnly 쿠키로 전달됨

#### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "accessToken": "NEW_JWT_ACCESS_TOKEN"
  }
}
```

---

### 카카오 로그인

- URL: `/kakao/login`
- Method: `GET`
- 설명: 카카오 인가 코드를 기반으로 로그인 처리합니다.

#### Query Parameter

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| code | String | 카카오 인가 코드 |

#### Response (기존 사용자)

```json
{
  "status": "SUCCESS",
  "data": {
    "signup": false,
    "token": "JWT_ACCESS_TOKEN"
  }
}
```

#### Response (신규 사용자)

```json
{
  "status": "SUCCESS",
  "data": {
    "signup": true,
    "kakaoId": "123456789",
    "name": "홍길동"
  }
}
```

- `Set-Cookie` 헤더에 HttpOnly Refresh 토큰 포함