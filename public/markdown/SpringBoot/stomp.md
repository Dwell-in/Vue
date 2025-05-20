# [Spring Boot] [Vue3] STOMP를 이용한 웹 소켓 실시간 채팅

> `STOMP`는 Simple Text Oriented Messaging Protocol의 약자입니다.
> 간단한 메시지를 전송하기 위한 프로토콜로 웹 소켓 채팅을 쉽게 구현할 수 있게 도와줍니다.

---

## 화면 예시

| ![](https://velog.velcdn.com/images/ksj0314/post/93b885ee-4f7c-40d9-8401-c02f8e7f479b/image.png) |
| :----------------------------------------------------------------------------------------------: |

---

## 구현 방법 - Spring Boot

### 1. 의존성 추가

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

---

### 2. config

```java
@Configuration
@EnableWebSocketMessageBroker
public class ChatConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
      registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:8080").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/sub");
        registry.setApplicationDestinationPrefixes("/pub");
    }
}
```

- 서버의 WebSocket endpoint를 지정합니다. `/ws`
- 구독 : `sub` 접두사로 시작하는 메시지를 브로커가 처리하도록 설정합니다. 클라이언트는 이 접두사로 시작하는 주제를 구독하여 메시지를 받을 수 있습니다.
- 발행 : `pub` 접두사로 시작하는 메시지는 @MessageMapping이 달린 메서드로 라우팅됩니다. 클라이언트가 서버로 메시지를 보낼 때 이 접두사를 사용합니다.

---

### 3. controller

```java
@Controller
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessageSendingOperations smso;

    // 채팅 리스트 반환
    @ResponseBody
    @GetMapping("/chat/{id}")
    public List<ChatMessage> getChatMessages(@PathVariable Long id){
      ~~~
    }

    //메시지 송신 및 수신, 클라이언트 단에선 /pub/message로 요청
    @MessageMapping("/message")
    public void receiveMessage(ChatMessage chat) {
        smso.convertAndSend("/sub/chatroom/" + chat.getRoomId(), chat);
        // DB에 저장 추가 하기
    }
}
```

- 클라이언트에서 `/pub/message`으로 요청시 `@MessageMapping("/message")`으로 매핑된 메서드가 실행됩니다.
- `smso.convertAndSend("/sub/chatroom/" + chat.getRoomId(), chat)`으로 구독중인 모든 사용자에게 해당 메시지가 전달됩니다.

---

## 구현 방법 - Vue3

### 1. 라이브러리 설치

> npm install sockjs-client

- SockJS 라이브러리를 프로젝트에 설치합니다.

---

### 2. 웹 소켓 연결

```js
const stompClient = ref(null)
const connect = () => {
  const socket = new SockJS('http://localhost:8081/ws') // 서버의 WebSocket endpoint
  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe(`/sub/chatroom/${roomId.value}`, (message) => {
        const msg = JSON.parse(message.body)
        messages.value.push(msg)
      })
    },
  })

  client.activate()
  stompClient.value = client
}

onMounted(() => {
  connect()
})
```

- 웹 소켓은 연결하는 `connect` 함수를 작성하여 `onMounted()`에서 사용합니다.
- stompClient 객체를 생성합니다.
- 해당 객체는 `.subscribe()`를 사용하여 채팅방을 구독하며 해당 경로에서 발행되는 데이터를 받을 수 있습니다.
- `messages.value.push(msg)`를 통해 화면에 렌더링 될 메시지를 설정했습니다.

---

### 3. 메시지 전송

```js
const input = ref('')
const sendMessage = () => {
  if (!stompClient.value || !stompClient.value.connected) return
  if (!input.value.trim()) return // 공백은 무시

  const msg = {
    roomId: roomId.value,
    sender: props.loginUserId,
    content: input.value,
    sentAt: new Date(),
  }

  stompClient.value.publish({
    destination: '/pub/message',
    body: JSON.stringify(msg),
  })
  input.value = ''
}
```

- stompClient의 `.publish()`를 사용하여 메시지를 전송할 수 있습니다.
- 내가 전송한 메시지도 서버에서 다시 수신 받습니다.
  때문에, 메시지를 렌더링하는 로직은 전송 부분에서 사용하지 않습니다.

---

### 4. 연결 해제

```js
onBeforeUnmount(() => {
  if (stompClient.value) {
    stompClient.value.deactivate()
  }
})
```

- 불필요한 네트워크 연결 유지를 방지하기 위해 마운트 해제시 연결을 해제합니다.
