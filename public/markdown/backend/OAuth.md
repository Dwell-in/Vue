# 0. 개념

## OAuth

인터넷 사용자들이 비밀번호를 제공하지 않고 다른 웹사이트 상의 자신들의 정보에 대해 웹사이트나 애플리케이션의 접근 권한을 부여할 수 있는 공통적인 수단으로서 사용되는, 접근 위임을 위한 개방형 표준

OAuth 2.0은 1.0에서 알려진 보안 문제 등을 개선한 버전

# 1. 카카오 애플리케이션 등록

[https://developers.kakao.com/](https://developers.kakao.com/)

- 내 애플리케이션 → 애플리케이션 추가
    
![](https://velog.velcdn.com/images/ksj0314/post/7afc1085-588d-4807-aaa1-5ba65d4527df/image.png)
    
- 필요한 정보 등록
- 앱 키 → REST API 키 받기
- 플랫폼 → Web 플랫폼 등록
    
    도메인을 구매하지 않았을 때는 [localhost](http://localhost) 주소와 사용하던 포트번호를 저장.
    실제 서비스할 때는 도메인 구매 후 도메인 주소를 기입
    
    ![](https://velog.velcdn.com/images/ksj0314/post/2d6e6abe-f46a-4482-8ffe-90efc574e2ea/image.png)
    
- 카카오 로그인 활성화
    
    ![](https://velog.velcdn.com/images/ksj0314/post/171090d1-12dc-4fb8-b91b-142eef3fffcd/image.png)
    
    → Redirect URI 등록 버튼을 눌러 카카오 로그인에서 사용할 OAuth Redirect URI 설정
    
    → **로그인이 정상적으로 되었을 경우 응답받을 주소**임
    
    http://localhost:8080/api/v1/member/kakao/callback
    
- 동의 항목 → 각 항목 설정
    
    카카오 로그인으로 서비스를 시작할 때 동의받는 항목 설정
    
    ![](https://velog.velcdn.com/images/ksj0314/post/4ae24119-6615-4435-9a3a-11e62acdd510/image.png)
    
    ![](https://velog.velcdn.com/images/ksj0314/post/a0b0d1b3-cbce-4632-a091-ece3b429df03/image.png)
    

# 2. 인가 코드 받기

## 로그인 버튼 만들기

직접 버튼을 만들어도 되고, 도구 → 리소스 다운로드에서 카카오 로그인 버튼을 다운로드받을 수 있음

## URL 주소 등록

문서 → 카카오 로그인 → REST API

https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api

![](https://velog.velcdn.com/images/ksj0314/post/d5069bc0-b698-4e5c-bdfc-f83cd5ba7aa7/image.png)

필요한 쿼리 파라미터를 포함해서 URL 삽입해주면 됨

[`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`](https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=$%7BREST_API_KEY%7D&redirect_uri=$%7BREDIRECT_URI%7D)

링크를 잘 설정했다면?

![](https://velog.velcdn.com/images/ksj0314/post/4efc4011-1a5b-4fda-99af-2084ef00dddf/image.png)

정상적으로 페이지 이동, Redirect URI 등록한 경로로 인가 코드 전달

# 3. 로그인 토큰 받기

인가 코드를 사용해서 로그인 토큰을 받아야 최종 로그인 처리가 완료됨

- 자바스크립트

RedirectURI를 로그인 페이지로 설정하고, 로그인 페이지에서 code라는 파라미터가 있다면 AJAX로 Member Controller에 액세스 토큰을 요청하도록 하기

```jsx
(async () => {
    if (code) {
        const accessToken = await getAccessToken(code);
        const userInfo = await getUserInfo(accessToken);
        ...
const getAccessToken = async (code) => {
    const response = await fetch(`${root}/api/v1/member/kakao/access-token?code=${code}`, {
        method: "GET",
    });
    const json = await response.json();
    console.log(json);
    return json.access_token;
};
```

- **ajax 요청을 위해 반드시 반복문 자체를 async로 선언**
- 컨트롤러
    
    코드를 기반으로 카카오에 액세스 토큰 요청, 응답을 return
    
    - HttpHeaders에 ContentType 등록
    - MultiValueMap에 파라미터 등록
    - HttpEntity로 연결, RestTemplate로 요청 보내기
    
    ```java
    @GetMapping("/kakao/access-token")
    	public ResponseEntity<?> kakaoCallback(@RequestParam String code){
    		HttpHeaders headers = new HttpHeaders();
    		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
    		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
    		params.add("grant_type", "authorization_code");
    		params.add("client_id", "7abe84cfdb3ff3310feaca8aa90809c0");
    		params.add("redirect_uri", "http://localhost:8080/member/login");
    		params.add("code", code);
    
    		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
    		
    		RestTemplate rt = new RestTemplate();
    		ResponseEntity<String> response = rt.postForEntity(
    		    "https://kauth.kakao.com/oauth/token", request, String.class
    		);
    		return response;
    	}
    ```
    
    - **컨트롤러에서 요청 보내는 형식 정도는 익혀두면 좋을 듯**

# 4. 유저 정보 받기

액세스 토큰을 받았다면, 카카오 로그인 자체는 성공한 것, 그러나 아직 로그인에 성공한 유저가 누구인지는 알 수 없음
→ 엑세스 토큰은 유저 정보를 얻기 위한 도구

- js
    
    ```jsx
    const getUserInfo = async (accessToken) => {
        const response = await fetch(`${root}/api/v1/member/kakao/user-info?accessToken=${accessToken}`, {
            method: "GET",
        });
        const json = await response.json();
        return json;
    };
    ```
    
- 컨트롤러
    
    get 요청을 보내는 것과 post 요청을 보내는 형태가 살짝 다름
    
    - HttpHeaders에 accessToken 정보 등록
    
    ```java
    @GetMapping("/kakao/user-info")
    	public ResponseEntity<?> getUserInfo(@RequestParam String accessToken){
    		HttpHeaders userInfoHeaders = new HttpHeaders();
    		RestTemplate rt = new RestTemplate();
    		userInfoHeaders.setBearerAuth(accessToken);
    
    		HttpEntity<Void> userInfoRequest = new HttpEntity<>(userInfoHeaders);
    
    		ResponseEntity<String> userInfoResponse = rt.exchange(
    		    "https://kapi.kakao.com/v2/user/me",
    		    HttpMethod.GET,
    		    userInfoRequest,
    		    String.class
    		);
    		return userInfoResponse;
    	}
    ```
    

# 5. 로그인 처리

유저 정보를 DB에 조회하여 DB에 있다면 로그인 처리, 없다면 회원가입 페이지로 이동

- JS
    
    ```jsx
            const response = await fetch(
                `${root}/api/v1/member/kakao/login?id=${userInfo.id}&nickname=${userInfo.properties.nickname}&profileImage=${userInfo.properties.profile_image}`
            );
            const result = await response.json();
    
            if (result.data.redirect == "/") {
                console.log(result);
                window.location.href = result.data.redirect;
            } else if (result.data.redirect == "/member/signup") {
                const params = new URLSearchParams({
                    id: result.data.id,
                    name: result.data.name,
                    profileImage: result.data.profileImage,
                });
                window.location.href = `${root}${result.data.redirect}?${params}`;
            }
    ```
    
    - 결과에 따라 페이지를 다륵 ㅔ이동
    - 로그인 성공 시 단순 인덱스 페이지로 redirect
    - 회원 정보가 없다면 파라미터 정보 전달해서 회원가입 페이지로 이동
- JAVA
    
    ```java
    @GetMapping("/kakao/login")
    	public ResponseEntity<?> getUserInfo(@RequestParam String id, @RequestParam String nickname,
    			@RequestParam String profileImage, HttpSession session){
    		String email = mService.findEmailByKakaoId(id);
    		try {
    			UserDetails member = cService.loadUserByUsername(email);
    			Authentication auth = new UsernamePasswordAuthenticationToken(member.getUsername(), null, member.getAuthorities());
    			
    			SecurityContext context = SecurityContextHolder.getContext();
    	        context.setAuthentication(auth);
    	        
    	        // 필터 체인을 적용하지 않기 때문에 수동으로 세션 scope에 저장해야 함
    	        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
    	        
    	        return handleSuccess(Map.of("redirect", "/"));
    		} catch (Exception e) {
    			return handleSuccess(Map.of(
    		            "redirect", "/member/signup",
    		            "id", id,
    		            "name", nickname,
    		            "profileImage", profileImage
    		        ));
    		}
    	}
    ```
    
    - UserInfo의 Primary Key를 기반으로 email 조회
        
        → 있다면 로그인 처리. 단 Spring Security를 사용하므로 **강제 로그인 처리**를 해야 함
        
        - Authentication 객체 생성
            
            이때 3가지 파라미터가 필요하고, 각각 아래와 같은 의미
            
            1. principal - **userdetails 객체** 자체 혹은 사용자 식별자(아이디 등)
            2. credentials - 비밀번호, 토큰 등. 이미 인증이 완료되었으므로 null로 처리해도 됨
            3. authorities - 권한 목록
        - 필터 체인을 적용하지 않으면 강제 저장되지 않음
        → 세션에 별도로 저장
    - 없다면 파라미터를 넘겨주고 회원가입 페이지로 이동