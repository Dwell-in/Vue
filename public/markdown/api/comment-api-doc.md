## Comment API 명세서

Base URL: `/api/v1/comment`

---

### 댓글 등록

- URL: ``
- Method: `POST`
- Content-Type: `application/json`
- 설명: 새로운 댓글을 등록합니다.

#### Request (RequestBody)

```json
{
  "boardId": 1,
  "userId": 10,
  "content": "댓글 내용입니다"
}
```

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": 1
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

### 댓글 목록 조회

- URL: `/{boardId}`
- Method: `GET`
- 설명: 게시글 ID에 해당하는 댓글 목록을 조회합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| boardId | int | 게시글 ID |

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": [
    {
      "commentId": 1,
      "boardId": 1,
      "userId": 10,
      "userName": "홍길동",
      "content": "댓글 내용입니다",
      "like": 3,
      "dislike": 0,
      "regdate": "2024-05-23T12:00:00"
    }
  ]
}
```

---

### 댓글 수정

- URL: `/{commentId}`
- Method: `PUT`
- Content-Type: `application/json`
- 설명: 댓글을 수정합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| commentId | int | 수정할 댓글 ID |

#### Request (RequestBody)

```json
{
  "boardId": 1,
  "userId": 10,
  "content": "수정된 댓글 내용입니다"
}
```

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": 1
}
```

---

### 댓글 삭제

- URL: `/{commentId}`
- Method: `DELETE`
- 설명: 댓글을 삭제합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| commentId | int | 삭제할 댓글 ID |

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": 1
}
```