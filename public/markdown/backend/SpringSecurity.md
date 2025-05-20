## 1. UserDetails 구현

UserDetails를 implements해서 getUsername, getPassword, getAuthorities() 등을 재정의

→ 프로젝트에서 사용하는 DTO의 타입에 맞게 적절한 값을 return하도록 설정

- 계정이 만료되었는지, 활성상태인지 등도 확인할 수 있음
- 코드
    
    ```java
    @Data
    @RequiredArgsConstructor
    public class CustomUserDetails implements UserDetails {
    
        private @NonNull MemberDTO member;
    
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            List<GrantedAuthority> roles = new ArrayList<>();
            if (member.getRole() != null) {
                roles.add(new SimpleGrantedAuthority("ROLE_" + member.getRole()));
            }
            return roles;
        }
    
        @Override
        public String getPassword() {
            return member.getPassword();
        }
    
        @Override
        public String getUsername() {
            // P.K로 사용되는 정보
            return member.getEmail();
        }
    }
    ```
    

## 2. UserDetailsService 구현

명시적으로 UserDetailsService를 구현한 클래스를 호출하지 않아도 Spring Security는 UserDetailsService를 구현한 클래스가 있다면 자동으로 사용함

- 이름 기반으로 멤버 객체를 불러오면 됨
- CustomUserDetails의 생성자에 member 객체를 매개변수로 사용
    
    ```java
    @Service
    @RequiredArgsConstructor
     public class CustomUserDetailsService implements UserDetailsService {
    	private final MemberDAO mDao;
    	
    	@Override
    	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    		MemberDTO member = mDao.selectMemberByEmail(username);
    		if(member == null) {
    			throw new UsernameNotFoundException(username);
    		}else {
    			return new CustomUserDetails(member);
    		}
    	}
    }
    ```
    

## 3. CustomSecurityConfig 생성

설정 파일인 CustomSecurityConfig에서 로그인, 로그아웃, 권한별 제한된 페이지 등을 정의할 수 있음

- 로그인, 로그아웃에서 사용자가 정의한 페이지를 사용할 수 있음
- 로그인, 로그아웃 요청이 들어오는 url에 로그인, 로그아웃 처리를 mapping할 수 있음
→ Spring Security가 자동으로 로그인, 로그아웃 처리

```java
@Configuration
@EnableWebSecurity
public class CustomSecurityConfig {

	@Bean
	RoleHierarchy roleHierachy() {
		// default prefix는 ROLE_
		return RoleHierarchyImpl.withDefaultRolePrefix().role("ADMIN").implies("USER").role("USER").implies("GUEST")
				.build();
	}

	// 내부적으로 BCryptPasswordEncoder를 사용
	@Bean
	PasswordEncoder passEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}
	
	@Bean
	SecurityFilterChain normalFileterChain(HttpSecurity http) throws Exception {
		// 임시로 수업때 사용한 경로 사용
		// 권한에 따라 접근할 수 있는 경로 지정해줘야 할 듯
    	http.authorizeHttpRequests(authorize -> authorize
    			.requestMatchers("/secured/admin/**").hasRole("ADMIN")
    			.requestMatchers("/secured/user/**").hasRole("USER")
    			.requestMatchers("/auth/**").authenticated()
    			.anyRequest().permitAll());
    	// csrf 토큰이 뭔지 아직 잘 몰라서 나중에 해보는 것도 좋을 것 같습니다
    	http.csrf(t -> t.disable());// csrf 생략
    	
    	http.formLogin(t -> t.loginPage("/member/login")
    			.loginProcessingUrl("/api/v1/member/login")
    			.usernameParameter("email")
    			.failureUrl("/member/login-form?error")
    			.permitAll() // 모든 사용자가 로그인 페이지에 접근할 수 있도록 하는 설정
    			);
    	
    	http.logout(t -> t.logoutUrl("/api/v1/member/logout")
    			.invalidateHttpSession(true)
    			.logoutSuccessUrl("/"));
//    			.deleteCookies("loginIdCooke")); // 나중에 쿠키 사용할 때 활성화
//    	로그인 폼에서 <input type="checkbox" name="remember-me"> 하면 로그인 유지하기 기능 사용할 수 있음
//    	http.rememberMe(t-> t.tokenValiditySeconds(60));
    	return http.build();
    }
}
```

## 4. 기존 컨트롤러 변경

- 기존 컨트롤러에 mapping된 로그인, 로그아웃 처리가 있다면 제거
- 멤버 객체를 session attribute 에 등록하지 않아도 자동으로 등록됨
컨트롤러 메소드의 매개변수에서
`*@AuthenticationPrincipal* CustomUserDetails details` 형식으로 접근 가능

## 5. 기존 페이지에서 사용

`${SPRING_SECURITY_CONTEXT}` 형식으로 사용할 수 있음 (자동으로 등록)