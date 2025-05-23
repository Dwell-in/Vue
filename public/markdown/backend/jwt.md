# 기본 흐름 및 개념

## JWT 토큰

JSON Web Token의 약자, 웹에서 사용자 인증과 권한 부여를 위해 널리 사용되는 토큰 기반 인증 방식 중 하나

### 구성

기본적으로 세 부분으로 구성된 문자열

1. Header
   토큰의 타입, 해싱 알고리즘 정보를 담고 있음
2. Payload
   사용자 정보, 기타 데이터를 담고 있는 부분. (만료 시간 등 포함)
   → 이 안에 담긴 정보는 누구나 디코딩해서 볼 수 있지만, 신뢰할 수 있는지는 확인할 수 없음
3. Signature
   Header + Payload를 비밀키를 이용해 해싱한 값
   → 토큰이 위변조되지 않았는지 확인할 수 있음

### 장점

- 서버에 세션 정보를 저장할 필요 없음 (StateLess이기 때문)
  → StateLess란 이전 상태(정보 → state)를 저장하지 않는다는 뜻. 따라서 매 요청마다 JWT를 보내고, 서버는 그 안의 정보를 검증하는 것
- 다양한 서비스 간 인증 정보 전달에 유용
- Base64 URL-safe 인코딩이라 HTTP 전송에 적합

### 주의점

- Payload는 암호화되지 않으므로 민감한 정보 저장 금지
- 만료 시간 설정 중요
- 토큰 저장 위치에 따라 보안 이슈 발생 가능

Spring Security를 사용할 때, FilterChain에 http.formLogin이 정의되어 있다면 Spring Security가 로그인을 담당하게 됨

```jsx
http.formLogin(t -> t.loginPage("/member/login")
  .loginProcessingUrl("/api/v1/member/login")
  .usernameParameter("email")
  .failureUrl("/member/login-form?error")
  .permitAll() // 모든 사용자가 로그인 페이지에 접근할 수 있도록 하는 설정
);
```

### 토큰을 발급하려면?

1. REST 형식으로 로그인을 직접 처리(Controller)
   → authenticationManager.authenticate()를 호출해서 처리하면 내부적으로 UserDetailsService가 호출되어 사용자 검증 수행.
   → 인증 객체는 생성해야 하므로 위와 같이 처리하면 간편함
2. JWT 응답으로 클라이언트 전달
3. 이후 요청에서 JWT 필터가 인증 처리

# 1. SecurityFilterChain

- formLogin, formLogout이 정의되어 있다면 삭제

```java
http.formLogin(t -> t.loginPage("/member/login")
  .loginProcessingUrl("/api/v1/member/login")
  .usernameParameter("email")
  .failureUrl("/member/login-form?error")
  .permitAll() // 모든 사용자가 로그인 페이지에 접근할 수 있도록 하는 설정
);

http.logout(t -> t.logoutUrl("/api/v1/member/logout")
  .invalidateHttpSession(true)
  .logoutSuccessUrl("/")
);
```

→ 기존에 존재한다면 삭제

- JWT 인증 필터를 추가
  `http.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);`
  - JwtAuthenticationFilter는 이후 직접 생성할 필터
- AuthenticationManager 등록
  컨트롤러에서 로그인 요청 처리를 위해 사용할 예정

```java
@Bean
AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
    return configuration.getAuthenticationManager();
}
```

# 2. JWT 토큰 생성 및 검증

JwtTokenProvider 클래스 생성

→ 보안 관련 유틸 컴포넌트에 가깝고, 구조상 서비스 계층에서 활용

### 의존성 추가

- 코드

```xml
  <dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
  </dependency>
  <dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
  </dependency>
  <dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
  </dependency>
</dependencies>
```

## 토큰 생성

### JWT Secret 사용

JWT를 생성하고 검증할 때 사용하는 비밀키

- 아무 문자열이나 넣어도 되지만, 복잡하고 예측 불가능한 값을 사용해야 함
- 보안 강화를 위해 단순 문자열보다는 java.security.Key 등의 객체 사용을 권장

```java
@Value("${jwt.secret}")
private String secret;
private Key secretKey;

@PostConstruct
public void init() {
  // Base64 인코딩된 키를 Key 객체로 변환
  byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
  this.secretKey = Keys.hmacShaKeyFor(keyBytes);
}
```

- jwt.secret을 HMAC-SHA 서명에 사용할 수 있는 Key 객체로 변환

### 토큰 생성

```java
// 토큰 생성
public String createToken(String username, Collection<? extends GrantedAuthority> roles) {
  Claims claims = Jwts.claims().setSubject(username);
  claims.put("roles", roles.stream().map(GrantedAuthority::getAuthority).toList());

  Date now = new Date();
  Date expiry = new Date(now.getTime() + validityInMilliseconds);

  return Jwts.builder()
          .setClaims(claims)
          .setIssuedAt(now)
          .setExpiration(expiry)
          .signWith(secretKey, SignatureAlgorithm.HS256)
          .compact();
}
```

- JWT Payload에 들어갈 Claims 객체 생성, setSubject에 토큰의 식별자(이메일, 사용자 ID 등)을 추가
- Claims에 권한 목록 저장
- 토큰 만료 시각 설정
- builder() 메소드로 JWT 문자열 생성
  - signWith()로 JWT에 서명 추가 → HMAC-SHA256 알고리즘 사용, SecretKey 객체를 키로 사용
  - compact()로 최종 JWT 문자열 생성

## 사용자 식별자 추출

```java
public String getUsername(String token) {
  return Jwts.parserBuilder()
          .setSigningKey(secretKey)
          .build()
          .parseClaimsJws(token)
          .getBody()
          .getSubject();
}
```

- 토큰의 서명을 검증하고 Body(Payload) 추출
- 최종적으로 사용자 이름 추출

```java
// 토큰에서 인증 정보 추출
public Authentication getAuthentication(String token) {
  String username = getUsername(token);
  UserDetails userDetails = userDetailsService.loadUserByUsername(username);
  return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
}
```

- 토큰에서 username 추출, DB에서 사용자 정보 조회
- 인증 정보를 바탕으로 UsernamePasswordAuthenticationToken 객체(Authentication 객체) 생성

## 토큰 유효성 검사

- 비밀 키를 바탕으로 실제로 토큰을 파싱, 서명이 유효한지 확인
- 현재 시각과 비교하여 토큰이 만료되지 않았으면 true 반환
- 토큰이 유효하지 않으면 false 반환

```java
public boolean validateToken(String token) {
  try {
    Jws<Claims> claims = Jwts.parserBuilder()
                              .setSigningKey(secretKey)
                              .build()
                              .parseClaimsJws(token);
    return !claims.getBody().getExpiration().before(new Date());
  } catch (Exception e) {
    return false;
  }
}
```

## 요청에서 토큰 추출

- HTTP 요청 헤더에서 Authorization 값을 꺼내 확인
- JWT는 “Bearer”라는 접두어와 함께 보내는 것이 표준 방식
  ex) Authorization: Bearer eyJhbGciOiJIUzI1NiJ9…
- 접두어를 제외한 실제 JWT 문자열만 잘라 반환

```java
public String resolveToken(HttpServletRequest request) {
  String bearer = request.getHeader("Authorization");
  if (bearer != null && bearer.startsWith("Bearer ")) {
    return bearer.substring(7);
  }
  return null;
}
```

# 3. 컨트롤러 설정

- 로그인 Request를 처리하기 위해 DTO 생성
- 로그인 처리용 RestController 생성
- authenticationManager를 사용해서 인증에 성공하면 토큰을 생성하고 응답

```java
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider jwtTokenProvider;

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest dto) {
    try {
      // 인증 시도
      Authentication authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
      );

      // 토큰 생성
      String token = jwtTokenProvider.createToken(
          dto.getEmail(),
          authentication.getAuthorities()
      );

        // 응답
      return ResponseEntity.ok(Map.of("token", token));

    } catch (AuthenticationException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                           .body(Map.of("error", "Invalid email or password"));
    }
  }
}
```

# 4. 필터 설정

- 요청 헤더에서 토큰을 추출하고, 유효성 검사를 진행하는 필터 생성
- 토큰이 유효하지 않으면 401 응답

  ```java
  @RequiredArgsConstructor
  public class JwtAuthenticationFilter extends OncePerRequestFilter {

  	private final JwtTokenProvider jwtTokenProvider;

  	@Override
  	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
  			throws ServletException, IOException {

  		String token = jwtTokenProvider.resolveToken(request);

  		if (token != null) {
  			if (jwtTokenProvider.validateToken(token)) {
  				Authentication auth = jwtTokenProvider.getAuthentication(token);
  				SecurityContextHolder.getContext().setAuthentication(auth);
  			} else {
  				// 토큰이 유효하지 않을 때 401 응답
  				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
  				response.setContentType("application/json");
  				response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
  				return;
  			}
  		}

  		filterChain.doFilter(request, response);
  	}
  }
  ```

- config 파일에 필터 등록
  - SecurityConfig 파일의 SecurityFilterChain 설정에 추가
    `http.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);`

# 5. 토큰 사용

## 로그인 처리

- 로그인 성공 시 백엔드 서버는 프론트 서버에 토큰 전달

  ```java
  axios.post("/api/v1/auth/login", { email, password })
    .then(res => {
      localStorage.setItem("token", res.data.data.token);
      // 상태 관리 라이브러리(ex. Pinia or Vuex)에 로그인 상태 저장도 가능
    });

  ```

- 로그인 상태 판단 기준은 토큰 보유 여부
  ```java
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  ```
- localStorage는 브라우저가 꺼져도 유지되므로 앱 시작 시 토큰이 있는지 확인해서 로그인 상태 복원
  ```java
  created() {
    const token = localStorage.getItem("token");
    if (token) {
      this.isLoggedIn = true;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
  ```

## 토큰 만료 처리

백엔드에서 토큰 만료 시 401 오류 응답을 주면 프론트에서 인터셉터로 토큰 삭제 + 로그인 페이지로 이동하는 형태로 처리

```java
axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      router.push({name: 'Login'});
    }
    return Promise.reject(err);
  }
);
```

## 프론트 요청

이후에는 Authorization 헤더에 토큰을 포함해야 함

```java
axios.get('/api/some-protected-endpoint', {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
});
```

- 모든 요청에 자동으로 붙이려면 Axios 인터셉터 설정도 가능
  ```java
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```

## 프로젝트 적용

기본적으로 localStorage에 저장하고 조회하도록 설정

auth.js 파일 생성

```java
const TOKEN_KEY = 'token'

export default {
  // 토큰 저장
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  },

  // 토큰 가져오기
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  // 토큰 삭제
  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
  },

  // 로그인 여부
  isLoggedIn() {
    return localStorage.getItem(TOKEN_KEY) != null
  },
}

```

### 로그인 처리

로그인 성공 시 응답에 전달된 토큰 정보를 localStorage에 저장

```jsx
const handleSubmit = async () => {
  try {
    const response = await api.post('/api/v1/auth/login', {
      email: email.value,
      password: password.value,
    })
    const token = response.data.token
    auth.setToken(token)

    router.push({ name: 'Home' })
  } catch (error) {
    console.log(error)
  }
}
```

localStorage를 조회해서, 현재 로그인이 처리되었는지 확인

```jsx
    <template v-if="auth.isLoggedIn()">
      <a href="#" @click="store.myToggle(true)"
        ><img class="profile" :src="loginUser?.profileImg || defaultProfile"
      /></a>
    </template>
```

### 로그아웃

유저 정보 삭제, localStorage에서 토큰 삭제

```jsx
const logout = async () => {
  auth.removeToken()
  loginUser.value = null
}
```

### Interceptor 설정

모든 요청의 Header에 Authorization 정보를 포함해야 하므로, Interceptor를 지정해서 모든 요청에 자동으로 포함되도록 설정

```jsx
api.interceptors.request.use((config) => {
  const token = auth.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```
