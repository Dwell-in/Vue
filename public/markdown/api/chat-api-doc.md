## Chat API 명세서

Base URL: ``

---

### 채팅 대상 목록 조회

- URL: `/chat/targets/{userId}`
- Method: `GET`
- 설명: 해당 사용자가 채팅을 나눈 대상 사용자 목록을 조회합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| userId | int | 사용자 ID |

#### Response

```json
{
  "status": "SUCCESS",
  "data": [ ... ]
}
```

---

### 채팅방 ID 조회

- URL: `/chat/roomId`
- Method: `GET`
- 설명: 두 사용자 간의 채팅방 ID를 조회합니다.

#### Request (Query Parameter - ChatRoomDTO)

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| user1Id | int | 사용자 1 ID |
| user2Id | int | 사용자 2 ID |

#### Response

```json
{
  "status": "SUCCESS",
  "data": "room123"
}
```

---

### 채팅 메시지 목록 조회

- URL: `/chat/{id}`
- Method: `GET`
- 설명: 채팅방 ID에 해당하는 메시지 목록을 조회합니다.

#### Path Variable

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| id | String | 채팅방 ID |

#### Response

```json
{
  "status": "SUCCESS",
  "data": [
    {
      "messageId": 1,
      "roomId": "room123",
      "sender": "user1",
      "content": "안녕하세요",
      "sentAt": "2024-05-24T10:00:00"
    }
  ]
}
```

---

### 채팅 메시지 송신 (WebSocket)

- WebSocket 엔드포인트: `/pub/message`
- 구독 경로: `/sub/chatroom/{roomId}`
- 설명: 채팅 메시지를 전송하고 해당 채팅방 구독자들에게 전달합니다.

#### 메시지 형식 (ChatMessageDTO)

```json
{
  "roomId": "room123",
  "sender": "user1",
  "content": "안녕하세요",
  "sentAt": "2024-05-24T10:00:00"
}
```