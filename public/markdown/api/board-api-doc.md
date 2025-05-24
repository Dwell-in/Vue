## Board API 명세서

Base URL: `/api/v1/board`

---

### 게시글 목록 조회

- URL: `/post-list`
- Method: `GET`
- 설명: 조건에 맞는 게시글 목록을 조회합니다.

#### Request (ModelAttribute)

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| categoryId | Long | X | 카테고리 ID |
| userName | String | X | 작성자 이름 |
| title | String | X | 게시글 제목 |
| content | String | X | 게시글 내용 |
| page | int | X | 페이지 번호 (기본값: 1) |
| size | int | X | 페이지당 항목 수 (기본값: 10) |

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": {
    "data": [
      {
        "boardId": 1,
        "categoryId": 2,
        "categoryName": "공지사항",
        "title": "제목입니다",
        "content": "내용입니다",
        "userId": 10,
        "userName": "홍길동",
        "viewCount": 123,
        "like": 10,
        "dislike": 1,
        "regTime": "2024-05-23T12:00:00"
      }
    ],
    "pageInfo": {
      "page": 1,
      "size": 10,
      "totalCount": 100,
      "totalPages": 10,
      "offset": 0
    }
  }
}
```

---

### 게시글 등록

- URL: `/board-write`
- Method: `POST`
- Content-Type: `application/json`
- 설명: 게시글을 등록합니다.

#### Request (RequestBody)

```json
{
  "categoryId": 2,
  "title": "제목입니다",
  "content": "내용입니다"
}
```

#### Response

- Status: 201 Created

```json
{
  "status": "SUCCESS",
  "data": {
    "boardId": 1,
    "categoryId": 2,
    "categoryName": null,
    "title": "제목입니다",
    "content": "내용입니다",
    "userId": 10,
    "userName": null,
    "viewCount": 0,
    "like": 0,
    "dislike": 0,
    "regTime": "2024-05-23T12:00:00"
  }
}
```

---

### 게시글 삭제

- URL: `/board-delete/{boardId}`
- Method: `POST`
- 설명: 게시글을 삭제합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| boardId | int | 삭제할 게시글 ID |

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": "삭제 성공"
}
```

---

### 게시글 수정

- URL: `/board-update/{boardId}`
- Method: `POST`
- Content-Type: `application/json`
- 설명: 게시글을 수정합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| boardId | int | 수정할 게시글 ID |

#### Request (RequestBody)

```json
{
  "categoryId": 2,
  "title": "수정된 제목",
  "content": "수정된 내용"
}
```

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": {
    "boardId": 1,
    "categoryId": 2,
    "categoryName": null,
    "title": "수정된 제목",
    "content": "수정된 내용",
    "userId": 10,
    "userName": null,
    "viewCount": 123,
    "like": 0,
    "dislike": 0,
    "regTime": "2024-05-23T12:00:00"
  }
}
```

---

### 게시글 상세 조회

- URL: `/board-detail/{boardId}`
- Method: `GET`
- 설명: 게시글 상세 정보를 조회합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| boardId | int | 조회할 게시글 ID |

#### Response

- Status: 200 OK

```json
{
  "status": "SUCCESS",
  "data": {
    "redirect": "/board/post-detail",
    "board": {
      "boardId": 1,
      "categoryId": 2,
      "categoryName": "공지사항",
      "title": "제목입니다",
      "content": "내용입니다",
      "userId": 10,
      "userName": "홍길동",
      "viewCount": 123,
      "like": 10,
      "dislike": 1,
      "regTime": "2024-05-23T12:00:00"
    }
  }
}
```