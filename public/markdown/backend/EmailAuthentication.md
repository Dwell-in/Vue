회원가입, 비밀번호 찾기 등에서 이메일 인증을 구현

# 1. 이메일 인증 토큰 생성

이메일 인증 요청 발생 시, UUID와 같은 고유 토큰 생성

- UUID(Universally Unique Identifier)는 다양한 분야에서 활용되는 전역 고유 식별자 표준
- 해당 토큰과 함께 이메일, 만료 시간 등을 DB에 저장

## 토큰을 발급하는 이유

- 이메일 소유 확인을 위한 유일하고 안전한 식별자가 필요함
- URL로 인증 정보를 안전하게 전달하는 수단
→ 직접 사용자 정보를 담을 수 없음
- 시간 제한 및 일회성
    
    만료 시간과 사용 여부를 지정할 수 있음 → 보안성 증가
    

### 1. DB Table 생성

```sql
CREATE TABLE `ssafyhome`.`email_verification_token` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiry_date DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE
);
```

### 2. DTO, DAO 생성

### 3. Service 구현

- UUID.randomUUID()로 UUID 토큰 생성
- 만료 시간 설정
    
    ```sql
    @Service
    @RequiredArgsConstructor
    public class EmailVerificationService {
    
        private final EmailVerificationTokenMapper tokenMapper;
    
        public String createVerificationToken(String email) {
            String token = UUID.randomUUID().toString();
            LocalDateTime expiry = LocalDateTime.now().plusMinutes(30);
    
            EmailVerificationToken tokenObj = EmailVerificationToken.builder()
                    .email(email)
                    .token(token)
                    .expiryDate(expiry)
                    .isUsed(false)
                    .build();
    
            tokenMapper.insertToken(tokenObj);
            return token;
        }
    }
    ```
    

# 2. 이메일 전송

Spring Email + JavaMailSener

### 1. 의존성 추가

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

### 2. [application.properties](http://application.properties) 설정

```xml
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
```

- 구글 **앱 비밀번호**를 발급받아야 함
    
    → 2단계 인증을 설정하고 발급받을 수 있음
    
- 587은 현대 SMTP 표준 포트번호, smtp.gmail.com은 Gmail의 메일 서버 주소

### 3. MailService 설정

JavaMailSender 사용

```java
@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {
        String subject = "[Dwell-In] 이메일 인증 요청";
        String frontUrl = "http://localhost:8080";
        String verificationUrl = frontUrl+"/email/verify?token=" + token;

        String text = "다음 링크를 클릭하여 이메일 인증을 완료해주세요:\n\n" + verificationUrl;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }
}
```

- subject에 메일 제목 지정
- To 보낼 email(프론트에서 받아오는 정보)
- Text에 보낼 메세지 설정

### 3-2. 텍스트 이외의 본문 전송

SimpleMailMessage는 단순 텍스트만 전송 가능

→ MimeMessage를 사용해서 HTML 코드 자체를 보낼 수 있음

- 링크, 이미지 등 실제 HTML 형태로 본문 전달 가능

```java
	public void sendVerificationEmail(String toEmail, String token) {
		try {

			String subject = "[Dwell-In] 이메일 인증 요청";
			String frontUrl = "http://localhost:8080";
			String verificationUrl = frontUrl + "/email/verify?token=" + token;

			String htmlContent = """
					    <p>다음 링크를 클릭하여 이메일 인증을 완료해주세요:</p>
					    <p><a href="%s">%s</a></p>
					""".formatted(verificationUrl, verificationUrl);
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

			helper.setTo(toEmail);
			helper.setSubject(subject);
			helper.setText(htmlContent, true);

			mailSender.send(message);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
```

### 4. EmailVerificationService 설정

- 토큰으로 데이터 조회하는 기능, 토큰 비활성화 기능 포함
- 토큰 생성 기능
    - UUID 토큰 발급
    - 토큰 만료 기간 설정
    
    ```java
    @Service
    @RequiredArgsConstructor
    public class EmailVerificationService {
    
        private final EmailVerificationTokenDAO tokenDao;
    
        public String createVerificationToken(String email) {
            String token = UUID.randomUUID().toString();
            LocalDateTime expiry = LocalDateTime.now().plusMinutes(30);
    
            EmailVerificationTokenDTO tokenObj = EmailVerificationTokenDTO.builder()
                    .email(email)
                    .token(token)
                    .expiryDate(expiry)
                    .isUsed(false)
                    .build();
    
            tokenDao.insertToken(tokenObj);
            return token;
        }
        
        public EmailVerificationTokenDTO findbyToken(String token) {
        	return tokenDao.selectByToken(token);
        }
        
        public void markTokenAsUsed(String token) {
        	tokenDao.markTokenAsUsed(token);
        }
    }
    ```
    

### 5. 토큰 생성하고 이메일 보내기

```java
	@PostMapping("/send-token")
	public ResponseEntity<?> sendToken(@RequestParam String email) {
		try {
			String token = eService.createVerificationToken(email);
			mailService.sendVerificationEmail(email, token);
			return handleSuccess("메일이 전송되었습니다");
		}catch (Exception e) {
			e.printStackTrace();
			return handleFail(e);
		}
	}
```

# 3. 인증 요청 처리

이메일 내 링크를 클릭하면 인증 처리

- 링크는 vue 서버로 mapping, vue 서버에서 backend 서버로 요청을 보내서 인증을 처리하도록 함
- 파라미터로 전달된 토큰으로 DB 조회, 토큰이 만료되었는지, 정상적인 토큰인지 확인 후 인증 처리

### vue 페이지

```java
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/lib/api'

const route = useRoute()
const router = useRouter()
const result = ref('이메일 인증을 확인 중입니다...')

onMounted(async () => {
  const token = route.query.token
  let msg

  if (!token) {
    msg = '잘못된 접근입니다. 인증 토큰이 없습니다.'
  }
  try {
    const res = await api.get(`/api/v1/email/verify?token=${token}`)
    console.log(res.data.data)
    msg = res.data.data.msg
    
  } catch (e) {
    msg = '인증 요청 처리 중 오류가 발생했습니다.'
  }
  result.value = msg
})
</script>

<template>
  <div class="verify-result">
    <h2>{{ result }}</h2>
  </div>
</template>
```

- 쿼리에 전달된 토큰을 기반으로 백엔드 서버에 인증 요청

### Controller

```java
	@GetMapping("/verify")
	public ResponseEntity<?> getMethodName(@RequestParam String token) {
		EmailVerificationTokenDTO tokenData = eService.findbyToken(token);
		String msg = "이메일 인증이 완료되었습니다";
		boolean success = false; 
		if(tokenData==null) msg = "유효하지 않은 링크입니다";
		else if(tokenData.isUsed()) msg = "이미 사용된 링크입니다";
		else if (tokenData.getExpiryDate().isBefore(LocalDateTime.now())) {
            msg =  "인증 링크가 만료되었습니다.";
        } else success = true;

		eService.markTokenAsUsed(token);
		return handleSuccess(Map.of("success",success,"msg",msg));
	}
```

성공 여부, 실패 시 메세지 전달

# 4. 검증 결과 처리

인증 정보를 기반으로 이메일 인증 성공했다는 정보 유지

- 웹소켓
- 세션 스토리지
- 토큰 발급 → 인증 페이지에 토큰 입력하도록 설정

여러 방법이 있음

### 로컬 스토리지 사용

기본 흐름

1. 인증 처리 페이지에서 백엔드 서버에 인증 요청
2. 인증이 완료되면 LocalStorage에 인증이 완료된 이메일 전달
3. 이메일 인증이 필요한 기존 페이지(회원가입 페이지)는 이메일 요청을 날린 순간부터 LocalStorage를 주기적으로 확인 (약 1초에 1번)
    
    → 규모가 커져 동시에 수천 건의 인증이 발생한다면 성능 저하 가능성
    
    하지만 소규모 요청 처리의 자원 소모는 무시해도 되는 수준
    
4. 기존 페이지에서 LocalStorage에 저장된 데이터를 확인, 현재 페이지의 정보와 일치하면 인증 처리
5. LocalStorage에서 원하는 데이터를 수신했을 때, DOM이 Unmount될 때 지속적 요청 중단
    
    회원가입이 완료되었을 때, DOM이 Unmount될 때 localStorage에 저장된 변수 초기화
    

### 1. LocalStorge에 인증 정보 저장

간략하게 인증에 성공한 이메일을 저장하는 형식으로 지정

- 자바스크립트에서는 localStorage라는 변수명으로 쉽게 접근 가능
- localStorage는 동일 도메인에서 공유 → 다른 탭에 창이 띄워져도 공유됨

```jsx
onMounted(async () => {
  const token = route.query.token
  let msg

  if (!token) {
    msg = '잘못된 접근입니다. 인증 토큰이 없습니다.'
  }
  try {
    const res = await api.get(`/api/v1/email/verify?token=${token}`)
    if (res.data.data.success === true) {
      const verifiedEmail = res.data.data.email
      localStorage.setItem('verifiedEmail', verifiedEmail)
    }
    console.log(res.data.data)
    msg = res.data.data.msg
  } catch (e) {
    msg = '인증 요청 처리 중 오류가 발생했습니다.'
  }
  result.value = msg
})
```

### 2. 주기적으로 정보 수신

회원가입 페이지에서 정보를 수신하는 부분

```jsx
const emailVerified = ref(false)
let checkInterval = null
watchEffect(() => {
  checkInterval = setInterval(() => {
    const stored = localStorage.getItem('verifiedEmail')
    if (stored === email.value) {
      emailVerified.value = true
      clearInterval(checkInterval) // setInterval 멈추기
    }
  }, 1000)
})
```

unmount 시 반복 작업 중단, localStorage에 저장된 변수 제거

```jsx
onBeforeUnmount(() => {
  clearInterval(checkInterval)
  localStorage.removeItem('verifiedEmail')
})
```