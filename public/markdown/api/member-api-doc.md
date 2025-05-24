## Member API 명세서

Base URL: `/api/v1/member`

---

### 회원가입

- URL: `/signup`
- Method: `POST`
- Content-Type: `multipart/form-data`
- 설명: 새로운 회원을 등록합니다.

#### Request

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| email | String | O | 이메일 |
| password | String | O | 비밀번호 |
| name | String | O | 이름 |
| phone | String | O | 휴대폰 번호 |
| img | MultipartFile | X | 프로필 이미지 (선택) |

#### Response

- Status: 201 Created

```json
{
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "password": "...",
    "phone": "010-1234-5678",
    "profile": null,
  }
}
```

- Status: 500 Internal Server Error

```json
{
  "status": "FAIL",
  "error": "에러 메시지"
}
```

---

### 회원 정보 수정

- URL: `/update`
- Method: `POST`
- 설명: 로그인된 사용자의 정보를 수정합니다.

#### Request

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| email | String | O | 이메일 |
| password | String | O | 비밀번호 |
| name | String | O | 이름 |
| phone | String | O | 휴대폰 번호 |

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "변경된 이름",
    "password": "...",
    "phone": "010-9876-5432",
    "role": "USER",
    "state": null,
    "profile": null,
    "kakaoId": null
  }
}
```

---

### 회원 삭제

- URL: `/delete`
- Method: `POST`
- 설명: 사용자를 삭제합니다.

#### Request

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| email | String | O | 삭제할 사용자 이메일 |

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": "삭제 성공"
}
```

---

### 비밀번호 초기화

- URL: `/password-find`
- Method: `POST`
- 설명: 이메일을 통해 비밀번호를 초기화합니다. 초기화된 비밀번호는 "12345"입니다.

#### Request

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| email | String | O | 비밀번호를 초기화할 이메일 |

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": {
    "password": "12345"
  }
}
```

---

### 이메일 중복 확인

- URL: `/check-email`
- Method: `POST`
- 설명: 이메일의 중복 여부를 확인합니다.

#### Request

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| email | String | O | 확인할 이메일 |

#### Response

- Status: 200 OK

```json
{
  "exists": true
}
```

---

### 로그인 사용자 정보 조회

- URL: `/user-info`
- Method: `GET`
- 설명: 현재 로그인한 사용자의 정보를 반환합니다.

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "profileImg": "data:image/jpeg;base64,...",
    "role": "USER"
  }
}
```