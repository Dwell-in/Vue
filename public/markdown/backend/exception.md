## @RestControllerAdivce

- @ControllerAdvice + @ResponseBody의 조합.
- Spring MVC 컨트롤러에서 발생하는 모든 예외를 잡아서 처리하는 Handler를 정의
- Spring MVC는 DispatcherServlet 단계에서 컨트롤러 실행 중 예외가 발생하면 @ControllerAdvice가 등록된 클래스 중 해당 예외 처리가 가능한 @ExceptionHandler가 있는지 자동으로 찾아 호출
- @ExceptionHandler에 메소드별로 처리할 예외 클래스들을 명시 가능
- 별도 세부 로직 처리가 필요없다면 굳이 try-catch 사용하지 않아도 됨
    
    ```java
        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException e) {
            return handleFail(e, HttpStatus.BAD_REQUEST);
        }
    
        @ExceptionHandler(NullPointerException.class)
        public ResponseEntity<?> handleNullPointer(NullPointerException e) {
            return handleFail(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    
        @ExceptionHandler(Exception.class)
        public ResponseEntity<?> handleGeneralException(Exception e) {
            return handleFail(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    ```
    
    - JSON 형식의 응답을 사용해야 하므로 RestControllerHelper에 정의된 메소드 재사용
    - 별도로 Exception 정의해서 메세지 설정하고 넘겨줘도 되지만, 어차피 프론트에서 다시 처리해야 함

## Spring Security

- Spring Secyrity 내부에서 발생한 인증/인가 관련 예외는 분리해야 함. 처리 형식이 조금 다름
- 이미 정의된 인터페이스들이 있고, 해당하는 메소드를 재사용해서 사용해야 함
- 직접 responseEntity를 반환하는 것이 아니라, HttpServletResponse를 조작해서 내용 전달
- JWT 토큰 필터는 유지해야 함
    - 이미 Spring Security처럼 HttpServletResponse를 조작 중
    - 토큰 유효성 검사 및 인증 객체 생성 및 주입

### AuthenticationEntryPoint

```java
@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint{

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        Map<String, Object> errorBody = Map.of(
            "status", "FAIL",
            "error", "로그인이이 필요합니다."
        );

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getWriter(), errorBody);
    }
}
```

### AccessDeniedHandler

```java
@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler, RestControllerHelper {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        Map<String, Object> errorBody = Map.of(
            "status", "FAIL",
            "error", "접근 권한이 없습니다."
        );

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getWriter(), errorBody);
    }
}
```

### config

- 인터페이스를 구현하고, SecurityFilterChain에 등록해야 함
- 구현한 객체는 빈으로 주입

```java
@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler, RestControllerHelper {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        Map<String, Object> errorBody = Map.of(
            "status", "FAIL",
            "error", "접근 권한이 없습니다."
        );

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getWriter(), errorBody);
    }
}
```